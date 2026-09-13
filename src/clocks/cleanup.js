import { Clocks } from "#medusa/modules";

export class CleanupClock extends Clocks {
    constructor(medusa) {
        super(medusa, {
            name: "cleanup",
            schedule: "0 0 * * *"
        });
    }

    async run() {
        const handler = this.medusa.modules.handlers.get(this.module, "items");
        if (!handler) return;

        this.medusa.console.log(this.medusa.console.levels.info, `[${this.module}] Running scheduled item cleanup.`);
        await handler.purge();
    }
}
