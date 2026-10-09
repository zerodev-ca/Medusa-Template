import { Pages } from "#medusa/modules";

export class TemplatePage extends Pages {
    constructor(medusa) {
        super(medusa, {
            name: "template",
            label: "Template Items",
            description: "View and manage registered template items.",
            icon: "box",
            group: "Modules",
            order: 1,
            component: "template",
            config: {
                endpoint: "/items"
            }
        });
    }

    async load({ client }) {
        try {
            const items = await client.send("GET", "/api/modules/template/items");
            return {
                available: true,
                data: {
                    items: Array.isArray(items) ? items : []
                }
            };
        } catch {
            return {
                available: true,
                data: {
                    items: []
                }
            };
        }
    }
}
