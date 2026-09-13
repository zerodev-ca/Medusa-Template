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
            component: "records",
            config: {
                endpoint: "/items"
            }
        });
    }
}
