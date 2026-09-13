import { Configs } from "#medusa/modules";

export class SettingsConfig extends Configs {
    constructor(medusa) {
        super(medusa, {
            name: "settings",
            label: "Template Settings",
            description: "Manage core module settings and interactive options.",
            preview: "template"
        });
    }

    schema() {
        return {
            enabled: {
                type: "boolean",
                label: "Module Enabled",
                default: true
            },
            channelPrefix: {
                type: "string",
                label: "Channel Prefix",
                default: "template-"
            },
            welcomeNotice: {
                type: "text",
                label: "Welcome Notice Text",
                default: "Welcome to the template module workspace. Manage your resources below."
            },
            maxItemsPerUser: {
                type: "number",
                label: "Max Items Per User",
                default: 10
            },
            operationMode: {
                type: "select",
                label: "Operation Mode",
                default: "standard",
                options: [
                    { value: "standard", label: "Standard Mode" },
                    { value: "advanced", label: "Advanced Mode" },
                    { value: "restricted", label: "Restricted Mode" }
                ]
            },
            embedColor: {
                type: "color",
                label: "Theme Accent Color",
                default: "#5865f2"
            },
            badgeEmoji: {
                type: "emoji",
                label: "System Badge Emoji",
                default: "✨"
            },
            alertChannel: {
                type: "channel",
                label: "Alert Channel",
                default: ""
            },
            allowedChannels: {
                type: "channels",
                label: "Allowed Command Channels",
                default: []
            },
            managerRole: {
                type: "role",
                label: "Manager Role",
                default: ""
            },
            exemptRoles: {
                type: "roles",
                label: "Exempt Roles",
                default: []
            },
            ticketCategory: {
                type: "category",
                label: "Primary Channel Category",
                default: ""
            },
            monitoredCategories: {
                type: "categories",
                label: "Monitored Categories",
                default: []
            },
            categories: {
                type: "list",
                label: "Resource Categories",
                default: [
                    {
                        identifier: "bundles",
                        label: "Bundles",
                        active: true,
                        quota: 50,
                        role: "",
                        channel: ""
                    },
                    {
                        identifier: "membership",
                        label: "Membership",
                        active: true,
                        quota: 100,
                        role: "",
                        channel: ""
                    }
                ],
                item: {
                    identifier: {
                        type: "string",
                        label: "Category ID",
                        default: ""
                    },
                    label: {
                        type: "string",
                        label: "Display Label",
                        default: ""
                    },
                    active: {
                        type: "boolean",
                        label: "Active State",
                        default: true
                    },
                    quota: {
                        type: "number",
                        label: "Quota Limit",
                        default: 10
                    },
                    role: {
                        type: "role",
                        label: "Required Role",
                        default: ""
                    },
                    channel: {
                        type: "channel",
                        label: "Associated Channel",
                        default: ""
                    }
                }
            },
            intakeQuestions: {
                type: "questions",
                label: "Registration Intake Questions",
                default: [
                    {
                        label: "What is your organization or team name?",
                        type: "short",
                        placeholder: "e.g. Acme Corp",
                        required: true,
                        options: "",
                        min: 1,
                        max: 1
                    },
                    {
                        label: "Describe your intended use case",
                        type: "paragraph",
                        placeholder: "Provide brief background details",
                        required: false,
                        options: "",
                        min: 1,
                        max: 1
                    }
                ]
            }
        };
    }
}
