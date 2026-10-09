# Medusa Module Template

The official module starter template for [Medusa](https://zerodev.ca), developed by Zero Development.

This repository provides a production-ready, batteries-included template for building custom Medusa modules. It demonstrates core subsystems, including database models, Discord commands, HTTP API routes, background clocks, dashboard schemas, audit logging, multi-language localization, automation flow nodes, leaderboard providers, bespoke React dashboard views, and interactive Discord components.

---

## Getting Started

### 1. Clone into Medusa

Clone this repository directly into your Medusa `modules/` folder or as an isolated git worktree:

```bash
git clone https://github.com/zerodev-ca/Medusa-Template modules/my-module
cd modules/my-module
```

Or when developing with git worktrees:

```bash
git worktree add modules/my-module -b module/my-module
```

### 2. Rename the Module

1. **`main.js`**: Update the `name` passed to `super()` to match your lowercase folder name.
2. **`resources/lang/*/common.json`**: Update `"module.<name>.name"` across all 16 locales with your capitalized display name.
3. **Subsystems**: Rename classes, models, and tables to fit your feature domain.

---

## Directory Layout

```text
modules/my-module/
├── main.js                      # Module entrypoint extending Modules
├── README.md                    # Developer guide
├── resources/
│   ├── config/                  # Dashboard configuration schemas (Configs)
│   │   └── settings.js          # Supported field types, groups, and options
│   ├── dashboard/               # Custom dashboard views and pages
│   │   └── pages/
│   │       └── template/
│   │           ├── page.js      # Page manifest class extending Pages with load()
│   │           └── view.tsx     # Rich React client component with Mantine/Tailwind UI
│   ├── lang/                    # Multilingual dictionaries for all 16 locales
│   │   ├── en/
│   │   │   ├── common.json      # Capitalized display name
│   │   │   └── messages.js      # English phrase and embed schemas (Langs)
│   │   ├── ... (15 other language folders)
│   │   └── translations.json    # Translations bundle
│   ├── leaderboards/            # Leaderboard providers (Leaderboards)
│   │   └── activity.js
│   ├── logs/                    # Audit logging channel definitions (Logs)
│   │   └── templateEvents.js
│   └── nodes/                   # Automation flow builder nodes (Nodes)
│       └── sendNotification.js
└── src/
    ├── clocks/                  # Scheduled background cron jobs (Clocks)
    │   └── cleanup.js
    ├── commands/                # Discord slash and prefix commands (Commands)
    │   └── template.js          # Slash commands, options, and UI components
    ├── events/                  # Discord gateway event listeners (Events)
    │   ├── messageCreate.js
    │   └── interactionCreate.js # Discord button, select menu, and modal handler
    ├── handlers/                # Core business logic and model calls (Handlers)
    │   └── Items.js
    ├── models/                  # PostgreSQL database tables (Models)
    │   └── Item.js
    └── routes/                  # Internal HTTP API endpoints (Routes)
        └── items/
            └── route.js
```

---

## Custom Dashboard Components (`resources/dashboard/`)

Modules can provide bespoke React dashboard pages mounted directly inside Medusa's dashboard shell.

### 1. Page Registration (`page.js`)

```js
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
            return { available: true, data: { items } };
        } catch {
            return { available: true, data: { items: [] } };
        }
    }
}
```

### 2. Client View Component (`view.tsx`)

Bespoke views import official design system components directly from `@/components/ui/*`:

- `Button` (`@/components/ui/button`): Supports variants (`default`, `secondary`, `outline`, `destructive`, `ghost`) and sizes (`sm`, `default`, `lg`, `icon`).
- `Select` (`@/components/ui/select`): Dropdown select menus with value bindings.
- `Input` (`@/components/ui/input`): Text, numeric, and search inputs.
- `Switch` (`@/components/ui/switch`): Boolean toggles.
- `Badge` (`@/components/ui/badge`): Semantic status tags.
- `Card`, `CardContent` (`@/components/ui/card`): Elevated containers for metrics, lists, and forms.
- `Modal` (`@/components/ui/modal`): Accessible modal dialogs with form controls and paired actions.

---

## Supported Configuration Field Types

The `resources/config/settings.js` file demonstrates configuration field types supported by Medusa:

1. `boolean`: Switch toggle.
2. `string`: Single-line text input.
3. `text`: Multi-line textarea.
4. `number`: Numeric input with step controls.
5. `select`: Dropdown select menu with static `options` or dynamic `source`.
6. `color`: Hex color picker.
7. `emoji`: Custom emoji picker.
8. `channel`: Single Discord channel selector.
9. `channels`: Multi-select Discord channels.
10. `role`: Single Discord role selector.
11. `roles`: Multi-select Discord roles.
12. `category`: Single Discord channel category selector.
13. `categories`: Multi-select Discord channel categories.
14. `list`: Dynamic repeater list containing nested schema definitions.
15. `questions`: Interactive multi-type questionnaire builder.

---

## Discord Interactive Components

Medusa enforces a strict 5-part custom ID format for all Discord message components:

```text
medusa:<component>:<module>:<name>:<describer>
```

Examples:
- `medusa:button:template:primary:action`
- `medusa:button:template:danger:delete`
- `medusa:select_menu:template:category:filter`
- `medusa:modal:template:submit:create`

### Gateway Interaction Handling (`src/events/interactionCreate.js`)

Medusa automatically validates and parses valid custom IDs into `interaction.customIdParsed`:

```js
if (interaction.isButton()) {
    if (!interaction.customIdParsed || interaction.customIdParsed.module !== "template") return;
    const action = interaction.customIdParsed.name;
    switch (action) {
        case "primary":
            return interaction.reply({ embeds: [this.medusa.embeds.info("Action triggered.")], flags: MessageFlags.Ephemeral });
    }
}
```

---

## Documentation

Full developer documentation and internal API specifications are available at:
[https://zerodev.ca/docs/medusa/developer-documentation](https://zerodev.ca/docs/medusa/developer-documentation)
