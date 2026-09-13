import { Nodes } from "#medusa/modules";

export class SendNotificationNode extends Nodes {
    constructor(medusa) {
        super(medusa, {
            name: "send_notification",
            title: "Send Notification",
            category: "Template",
            description: "Dispatches a template notification to a designated channel.",
            icon: "TbBell",
            accent: "indigo",
            hasTarget: true,
            hasSource: true,
            fields: [
                {
                    key: "channel",
                    type: "channel",
                    label: "Channel",
                    default: ""
                },
                {
                    key: "message",
                    type: "text",
                    label: "Message Content",
                    placeholder: "Notification for %user%",
                    default: ""
                }
            ],
            branches: []
        });
    }

    async run(context) {
        const channelId = context.text("channel", "");
        const rawMessage = context.text("message", "Template notification.");
        if (!channelId) return { success: false };

        const message = context.fill(rawMessage);
        await this.medusa.discord.post(channelId, { content: message });

        return { success: true };
    }
}
