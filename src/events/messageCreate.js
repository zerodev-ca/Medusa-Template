import { Events } from "#medusa/modules";
import { Events as DiscordEvents } from "discord.js";

export class MessageCreateEvent extends Events {
    constructor(medusa) {
        super(medusa, {
            name: "messageCreate",
            event: DiscordEvents.MessageCreate,
            once: false
        });
    }

    async run(message) {
        if (!message) return;
        if (!message.guild) return;
        if (message.author.bot) return;

        const enabled = this.medusa.modules.config.value(this.module, "settings", "enabled");
        if (!enabled) return;

        const handler = this.medusa.modules.handlers.get(this.module, "items");
        if (!handler) return;
    }
}
