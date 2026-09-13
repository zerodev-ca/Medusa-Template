import { Handlers } from "#medusa/modules";

export class ItemsHandler extends Handlers {
    constructor(medusa) {
        super(medusa, {
            name: "items"
        });
    }

    model() {
        return this.medusa.modules.models.get(this.module, "template_items");
    }

    async create(guildId, userId, identifier, name, options = {}) {
        if (!identifier) this.fail(400, "Identifier is required.");
        if (!name) this.fail(400, "Name is required.");

        const existing = await this.model().get({ identifier });
        if (existing) this.fail(409, `An item with identifier "${identifier}" already exists.`);

        return this.model().create({
            guildId,
            userId,
            identifier,
            name,
            ...options
        });
    }

    async get(identifier) {
        const item = await this.model().get({ identifier });
        if (!item) this.fail(404, `Item "${identifier}" was not found.`);
        return item;
    }

    async list(guildId) {
        return this.model().list(guildId ? { guildId } : {});
    }

    async delete(identifier) {
        const count = await this.model().delete({ identifier });
        if (count === 0) this.fail(404, `Item "${identifier}" was not found.`);
        return { success: true };
    }

    async purge() {
        return this.model().delete({ active: false });
    }
}
