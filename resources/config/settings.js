import { Configs } from "#medusa/modules";

export class SettingsConfig extends Configs {
    constructor(medusa) {
        super(medusa, {
            name: "settings",
            label: "Template Settings",
            description: "Manage core module settings and alert channels."
        });
    }

    schema() {
        return {
            enabled: {
                type: "boolean",
                label: "Module Enabled",
                default: true
            },
            alertChannel: {
                type: "channel",
                label: "Alert Channel",
                default: ""
            },
            adminRole: {
                type: "role",
                label: "Manager Role",
                default: ""
            },
            currencySymbol: {
                type: "string",
                label: "Currency Symbol",
                default: "$"
            },
            maxItems: {
                type: "number",
                label: "Maximum Items",
                default: 100
            },
            mode: {
                type: "select",
                label: "Operation Mode",
                default: "standard",
                options: [
                    { value: "standard", label: "Standard Mode" },
                    { value: "strict", label: "Strict Mode" }
                ]
            }
        };
    }
}
