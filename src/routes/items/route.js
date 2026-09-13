import { Routes } from "#medusa/modules";

export class ItemsRoute extends Routes {
    constructor(medusa) {
        super(medusa, {
            name: "items",
            path: "/items",
            authentication: { key: "secret" }
        });
    }

    async GET(request, response) {
        const handler = this.medusa.modules.handlers.get(this.module, "items");
        const guildId = request.query.guildId ? String(request.query.guildId) : this.medusa.settings.get("GUILD_ID");
        return handler.list(guildId);
    }

    async POST(request, response) {
        const handler = this.medusa.modules.handlers.get(this.module, "items");
        const { guildId, userId, identifier, name, quantity, price } = request.body;
        return handler.create(guildId, userId, identifier, name, { quantity, price });
    }

    async DELETE(request, response) {
        const handler = this.medusa.modules.handlers.get(this.module, "items");
        const identifier = String(request.query.identifier);
        return handler.delete(identifier);
    }
}
