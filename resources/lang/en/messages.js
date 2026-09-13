import { Langs } from "#medusa/modules";

export class MessagesLang extends Langs {
    constructor(medusa) {
        super(medusa, {
            name: "messages",
            label: "User Messages",
            description: "Discord responses and embed templates."
        });
    }

    schema() {
        return {
            created: {
                type: "phrase",
                label: "Item Created",
                default: "Successfully created item **%name%**."
            },
            deleted: {
                type: "phrase",
                label: "Item Deleted",
                default: "Successfully deleted item **%identifier%**."
            },
            notFound: {
                type: "phrase",
                label: "Item Not Found",
                default: "Item **%identifier%** was not found."
            },
            successEmbed: {
                type: "embed",
                label: "Success Notification",
                default: {
                    title: "Operation Succeeded",
                    description: "%custom_emoji_check% • Operation completed for **%user%**.",
                    color: "#22c55e"
                }
            }
        };
    }
}
