import { Models } from "#medusa/modules";

export class ItemModel extends Models {
    constructor(medusa) {
        super(medusa, {
            name: "template_items",
            dynamic: false
        });
    }

    schema() {
        return {
            guildId: { type: "bigint", required: true },
            userId: { type: "bigint", required: true },
            identifier: { type: "string", required: true, unique: true },
            name: { type: "string", required: true },
            description: { type: "text" },
            quantity: { type: "integer", default: 1 },
            price: { type: "float", default: 0.0 },
            active: { type: "boolean", default: true }
        };
    }
}
