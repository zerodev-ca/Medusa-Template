import { Modules } from "#medusa/modules";

export class TemplateModule extends Modules {
    constructor(medusa) {
        super(medusa, {
            name: "template",
            author: "Zero Development",
            version: "1.0.0.0",
            description: "Official module template for creating custom Medusa modules."
        });
    }

    permissions() {
        return [
            {
                id: "template:manage",
                name: "Template ( Manage )",
                description: "Administrative access to configure and manage template items.",
                group: "Template",
                module: "template"
            }
        ];
    }

    async onStartup() {
        this.medusa.console.log(this.medusa.console.levels.startup, `${this.getName()} module loaded successfully.`);
    }

    async onShutdown() {
        this.medusa.console.log(this.medusa.console.levels.info, `${this.getName()} module shut down.`);
    }
}
