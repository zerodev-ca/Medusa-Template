import { Commands } from "#medusa/modules";
import { MessageFlags } from "discord.js";

export class TemplateCommand extends Commands {
    constructor(medusa) {
        super(medusa, {
            name: "template",
            description: "Manage template items and configurations.",
            category: "General",
            baselinePermission: "moderator",
            options: [
                {
                    name: "list",
                    description: "List all items in the current server.",
                    type: "subcommand"
                },
                {
                    name: "create",
                    description: "Create a new template item.",
                    type: "subcommand",
                    options: [
                        {
                            name: "identifier",
                            description: "Unique item identifier slug.",
                            type: "string",
                            required: true
                        },
                        {
                            name: "name",
                            description: "Display name of the item.",
                            type: "string",
                            required: true
                        },
                        {
                            name: "quantity",
                            description: "Initial stock count.",
                            type: "integer",
                            required: false
                        },
                        {
                            name: "price",
                            description: "Unit price of the item.",
                            type: "number",
                            required: false
                        }
                    ]
                },
                {
                    name: "delete",
                    description: "Delete an existing template item.",
                    type: "subcommand",
                    options: [
                        {
                            name: "identifier",
                            description: "Identifier of the item to delete.",
                            type: "string",
                            required: true,
                            autocomplete: true
                        }
                    ]
                }
            ]
        });
    }

    async autocomplete(interaction) {
        const focused = interaction.options.getFocused(true);
        if (focused.name !== "identifier") return;

        const handler = this.medusa.modules.handlers.get(this.module, "items");
        if (!handler) return interaction.respond([]);

        const items = await handler.list(interaction.guild.id);
        const query = focused.value.toLowerCase();
        const matches = items
            .filter(item => item.identifier.toLowerCase().includes(query) || item.name.toLowerCase().includes(query))
            .slice(0, 25);

        return interaction.respond(matches.map(item => ({
            name: `${item.name} (${item.identifier})`,
            value: item.identifier
        })));
    }

    async run(interaction) {
        const allowed = await this.medusa.permissions.guard(interaction, this.getName());
        if (!allowed) return;

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const subcommand = interaction.options.getSubcommand();
        const handler = this.medusa.modules.handlers.get(this.module, "items");

        switch (subcommand) {
            case "list": {
                const items = await handler.list(interaction.guild.id);
                if (items.length === 0) {
                    return interaction.editReply({
                        embeds: [this.medusa.embeds.info("info", "No items have been registered yet.")]
                    });
                }
                return interaction.editReply({
                    embeds: [
                        this.medusa.embeds.default({
                            title: "Registered Template Items",
                            description: items.map(item => `• **${item.name}** (\`${item.identifier}\`) - Stock: ${item.quantity} - Price: $${item.price}`).join("\n")
                        })
                    ]
                });
            }
            case "create": {
                const identifier = interaction.options.getString("identifier", true);
                const name = interaction.options.getString("name", true);
                const rawQuantity = interaction.options.getInteger("quantity");
                const quantity = rawQuantity !== null ? rawQuantity : 1;
                const rawPrice = interaction.options.getNumber("price");
                const price = rawPrice !== null ? rawPrice : 0.0;

                try {
                    await handler.create(interaction.guild.id, interaction.user.id, identifier, name, { quantity, price });
                    await this.medusa.logs.post(this.module, "itemCreated", {
                        actor: interaction.user,
                        subject: name,
                        fields: [
                            { name: "Identifier", value: identifier, inline: true },
                            { name: "Price", value: `$${price}`, inline: true }
                        ]
                    });
                    return interaction.editReply({
                        embeds: [this.medusa.embeds.success(this.medusa.modules.lang.phrase(this.module, "messages", "created", { name }))]
                    });
                } catch (error) {
                    return interaction.editReply({
                        embeds: [this.medusa.embeds.error(error.message)]
                    });
                }
            }
            case "delete": {
                const identifier = interaction.options.getString("identifier", true);

                try {
                    await handler.delete(identifier);
                    await this.medusa.logs.post(this.module, "itemDeleted", {
                        actor: interaction.user,
                        subject: identifier
                    });
                    return interaction.editReply({
                        embeds: [this.medusa.embeds.success(this.medusa.modules.lang.phrase(this.module, "messages", "deleted", { identifier }))]
                    });
                } catch (error) {
                    return interaction.editReply({
                        embeds: [this.medusa.embeds.error(error.message)]
                    });
                }
            }
            default:
                return interaction.editReply({
                    embeds: [this.medusa.embeds.error("Unknown subcommand.")]
                });
        }
    }
}
