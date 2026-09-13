import { Commands } from "#medusa/modules";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder,
    ChannelSelectMenuBuilder,
    ChannelType,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    MessageFlags
} from "discord.js";

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
                },
                {
                    name: "components",
                    description: "Demonstrate Discord buttons and select menu components.",
                    type: "subcommand"
                },
                {
                    name: "modal",
                    description: "Open an interactive Discord modal form.",
                    type: "subcommand"
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

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "modal") {
            const modal = new ModalBuilder()
                .setCustomId("medusa:modal:template:submit:create")
                .setTitle("Register Template Item");

            const idInput = new TextInputBuilder()
                .setCustomId("identifier")
                .setLabel("Item Identifier")
                .setPlaceholder("e.g. bundle_starter")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const nameInput = new TextInputBuilder()
                .setCustomId("name")
                .setLabel("Display Name")
                .setPlaceholder("e.g. Starter Pack")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const quantityInput = new TextInputBuilder()
                .setCustomId("quantity")
                .setLabel("Initial Stock Quantity")
                .setPlaceholder("e.g. 25")
                .setStyle(TextInputStyle.Short)
                .setRequired(false);

            modal.addComponents(
                new ActionRowBuilder().addComponents(idInput),
                new ActionRowBuilder().addComponents(nameInput),
                new ActionRowBuilder().addComponents(quantityInput)
            );

            return interaction.showModal(modal);
        }

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
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
            case "components": {
                const buttonRow = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId("medusa:button:template:primary:action")
                        .setLabel("Primary Action")
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId("medusa:button:template:secondary:action")
                        .setLabel("Secondary")
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId("medusa:button:template:success:action")
                        .setLabel("Confirm")
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId("medusa:button:template:danger:action")
                        .setLabel("Delete")
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setLabel("Documentation")
                        .setStyle(ButtonStyle.Link)
                        .setURL("https://zerodev.ca")
                );

                const selectRow = new ActionRowBuilder().addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId("medusa:select_menu:template:category:filter")
                        .setPlaceholder("Select a category filter")
                        .addOptions([
                            { label: "Bundles", value: "bundles", description: "All bundle packages" },
                            { label: "Membership", value: "membership", description: "VIP and tier memberships" },
                            { label: "Cosmetics", value: "cosmetics", description: "Visual items and trail effects" },
                            { label: "Boosters", value: "boosters", description: "XP and currency boosters" }
                        ])
                );

                const channelRow = new ActionRowBuilder().addComponents(
                    new ChannelSelectMenuBuilder()
                        .setCustomId("medusa:select_menu:template:channel:notification")
                        .setPlaceholder("Select a notification channel")
                        .addChannelTypes(ChannelType.GuildText)
                );

                return interaction.editReply({
                    embeds: [
                        this.medusa.embeds.default({
                            title: "Discord UI Components Showcase",
                            description: "Demonstration of interactive Discord message buttons, select menus, and channel selectors managed by the template module."
                        })
                    ],
                    components: [buttonRow, selectRow, channelRow]
                });
            }
            default:
                return interaction.editReply({
                    embeds: [this.medusa.embeds.error("Unknown subcommand.")]
                });
        }
    }
}
