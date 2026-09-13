import { Logs } from "#medusa/modules";

export class TemplateEvents extends Logs {
    constructor(medusa) {
        super(medusa, {
            name: "templateEvents",
            label: "Template Events",
            description: "Audit logging for template items and configuration updates.",
            icon: "box",
            colour: "#22c55e"
        });
    }

    events() {
        return {
            itemCreated: {
                label: "Item Created",
                title: "%custom_emoji_check% • <server> » Item Created",
                summary: "%subject% was created by %actor%.",
                verb: "created",
                color: "#22c55e",
                default: true
            },
            itemDeleted: {
                label: "Item Deleted",
                title: "%custom_emoji_cross% • <server> » Item Deleted",
                summary: "%subject% was deleted by %actor%.",
                verb: "deleted",
                color: "#ef4444",
                default: true
            }
        };
    }
}
