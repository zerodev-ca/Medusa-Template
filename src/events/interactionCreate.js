import { Events } from "#medusa/modules";
import { Events as DiscordEvents, MessageFlags } from "discord.js";

export class InteractionCreateEvent extends Events {
    constructor(medusa) {
        super(medusa, {
            name: "templateInteractionCreate",
            event: DiscordEvents.InteractionCreate,
            once: false
        });
    }

    async run(interaction) {
        if (!interaction) return;
        if (!interaction.guildId) return;

        if (interaction.isButton()) {
            if (!interaction.customIdParsed || interaction.customIdParsed.module !== "template") return;

            const action = interaction.customIdParsed.name;
            switch (action) {
                case "primary":
                    return interaction.reply({
                        embeds: [this.medusa.embeds.info("info", "Primary button action triggered.")],
                        flags: MessageFlags.Ephemeral
                    });
                case "secondary":
                    return interaction.reply({
                        embeds: [this.medusa.embeds.info("info", "Secondary button action triggered.")],
                        flags: MessageFlags.Ephemeral
                    });
                case "success":
                    return interaction.reply({
                        embeds: [this.medusa.embeds.success("Confirmation action confirmed successfully.")],
                        flags: MessageFlags.Ephemeral
                    });
                case "danger":
                    return interaction.reply({
                        embeds: [this.medusa.embeds.warning("Destructive action processed.")],
                        flags: MessageFlags.Ephemeral
                    });
                default:
                    return interaction.deferUpdate().catch(() => {});
            }
        }

        if (interaction.isStringSelectMenu()) {
            if (!interaction.customIdParsed || interaction.customIdParsed.module !== "template") return;

            const selected = interaction.values && interaction.values.length > 0 ? interaction.values[0] : "none";
            return interaction.reply({
                embeds: [this.medusa.embeds.info("info", `Category selected: **${selected}**`)],
                flags: MessageFlags.Ephemeral
            });
        }

        if (interaction.isChannelSelectMenu()) {
            if (!interaction.customIdParsed || interaction.customIdParsed.module !== "template") return;

            const selectedChannel = interaction.values && interaction.values.length > 0 ? interaction.values[0] : "none";
            return interaction.reply({
                embeds: [this.medusa.embeds.info("info", `Notification channel linked: <#${selectedChannel}>`)],
                flags: MessageFlags.Ephemeral
            });
        }

        if (interaction.isModalSubmit()) {
            if (!interaction.customIdParsed || interaction.customIdParsed.module !== "template") return;

            const identifier = interaction.fields.getTextInputValue("identifier");
            const name = interaction.fields.getTextInputValue("name");
            const rawQuantity = interaction.fields.getTextInputValue("quantity");
            const parsedQuantity = parseInt(rawQuantity, 10);
            const quantity = Number.isNaN(parsedQuantity) ? 1 : parsedQuantity;

            const handler = this.medusa.modules.handlers.get(this.module, "items");
            if (!handler) {
                return interaction.reply({
                    embeds: [this.medusa.embeds.error("Template items handler is unavailable.")],
                    flags: MessageFlags.Ephemeral
                });
            }

            try {
                await handler.create(interaction.guildId, interaction.user.id, identifier, name, { quantity, price: 0.0 });
                return interaction.reply({
                    embeds: [this.medusa.embeds.success(`Registered item **${name}** (\`${identifier}\`) via Discord Modal.`)],
                    flags: MessageFlags.Ephemeral
                });
            } catch (error) {
                return interaction.reply({
                    embeds: [this.medusa.embeds.error(error.message)],
                    flags: MessageFlags.Ephemeral
                });
            }
        }
    }
}
