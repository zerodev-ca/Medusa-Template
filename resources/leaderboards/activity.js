import { Leaderboards } from "#medusa/modules";

export class ActivityLeaderboard extends Leaderboards {
    constructor(medusa) {
        super(medusa, {
            name: "template_activity",
            label: "Template Activity",
            group: "Community",
            format: "number",
            emoji: "⭐",
            unit: "Items",
            singular: "Item",
            order: 1
        });
    }

    async list(guild) {
        const handler = this.medusa.modules.handlers.get(this.module, "items");
        if (!handler) return [];

        const items = await handler.list(guild.id);
        const userCounts = new Map();

        for (const item of items) {
            const current = userCounts.get(item.userId) ? userCounts.get(item.userId) : 0;
            userCounts.set(item.userId, current + item.quantity);
        }

        return Array.from(userCounts.entries())
            .map(([userId, total]) => ({
                userId: String(userId),
                value: total,
                sub: `Total Items: ${total}`,
                stats: [
                    { label: "Items", value: total }
                ]
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 100);
    }
}
