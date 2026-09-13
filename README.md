# Medusa Module Template

The official module starter template for [Medusa](https://zerodev.ca), developed by Zero Development.

This repository provides a production-ready, batteries-included template for building custom Medusa modules. It demonstrates every subsystem, including database models, Discord commands, HTTP API routes, background clocks, dashboard schemas, audit logging, multi-language localization, automation flow nodes, leaderboard providers, custom React dashboard views, live config previews, and interactive Discord components.

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
2. **`package.json`**: Update the package `name` field.
3. **`resources/lang/*/common.json`**: Update `"module.<name>.name"` across all 16 locales with your capitalized display name.
4. **Subsystems**: Rename classes, models, and tables to fit your feature domain.

---

## Directory Layout

```text
modules/my-module/
├── main.js                      # Module entrypoint extending Modules
├── package.json                 # Module package metadata
├── README.md                    # Developer guide
├── resources/
│   ├── config/                  # Dashboard configuration schemas (Configs)
│   │   └── settings.js          # All 15 field types + live preview link
│   ├── dashboard/               # Custom dashboard views and previews
│   │   ├── pages/
│   │   │   └── template/
│   │   │       ├── page.js      # Page manifest class extending Pages
│   │   │       ├── loader.ts    # Server-side Next.js data loader
│   │   │       └── view.tsx     # Rich React client component with Mantine/Tailwind UI
│   │   └── previews/
│   │       └── template.tsx     # Live interactive configuration preview
│   ├── docs/                    # In-dashboard markdown documentation
│   │   └── index.md
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
    │   └── template.js          # Slash commands, options, autocomplete, and UI components
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

Modules can provide fully bespoke React dashboard pages mounted directly inside Medusa's Next.js dashboard shell.

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
}
```

### 2. Server Data Loader (`loader.ts`)

```ts
import type { ModuleLoader } from "@/components/pages/types";
import { medusa } from "@/lib/medusa";

const loader: ModuleLoader = async (module) => {
    try {
        const data = await medusa.moduleData(module, "/items");
        return { available: true, data };
    } catch {
        return {
            available: true,
            data: { items: [], stats: { total: 0, active: 0, categories: 0 } }
        };
    }
};

export default loader;
```

### 3. Client View Component (`view.tsx`)

Bespoke views import official design system components directly from `@/components/ui/*`:

- `Button` (`@/components/ui/button`): Supports variants (`default`, `secondary`, `outline`, `destructive`, `ghost`) and sizes (`sm`, `default`, `lg`, `icon`).
- `Select` (`@/components/ui/select`): Dropdown select menus with value bindings and placeholder states.
- `Input` (`@/components/ui/input`): Text, numeric, and search inputs.
- `Switch` (`@/components/ui/switch`): Boolean toggles.
- `Badge` (`@/components/ui/badge`): Semantic status tags.
- `Card`, `CardContent` (`@/components/ui/card`): Elevated containers for metrics, lists, and forms.
- `Modal` (`@/components/ui/modal`): Accessible modal dialogs with form controls and paired actions.

---

## Live Configuration Previews (`previews/`)

Link any configuration group in `Configs` to a live interactive preview component using `preview: "<id>"`:

```js
export class SettingsConfig extends Configs {
    constructor(medusa) {
        super(medusa, {
            name: "settings",
            label: "Template Settings",
            description: "Manage core module settings.",
            preview: "template"
        });
    }
}
```

The preview component at `resources/dashboard/previews/template.tsx` receives live form values:

```tsx
import type { PreviewProps } from "@/components/pages/types";

export default function TemplateConfigPreview({ values, user }: PreviewProps) {
    return (
        <div>...</div>
    );
}
```

---

## Supported Configuration Field Types

The `resources/config/settings.js` file demonstrates all 15 configuration field types supported by Medusa:

1. `boolean`: Switch toggle.
2. `string`: Single-line text input.
3. `text`: Multi-line textarea with emoji picker support.
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
            return interaction.reply({ embeds: [...], flags: MessageFlags.Ephemeral });
        ...
    }
}
```

---

## Architecture Rules

When developing official or commercial Medusa modules, follow these architecture standards:

1. **No comments in code**: Write clean, self-describing code without inline comments.
2. **Strict architecture**: Place business logic in `handlers/`, database queries in `models/`, and interactions in `commands/` or `routes/`.
3. **No optionals or fallbacks**: Avoid optional chaining (`?.`), nullish coalescing (`??`), and logical OR value fallbacks (`||`). Use explicit condition checks.
4. **All 16 languages supported**: Provide translation dictionaries across `en`, `fr`, `es-ES`, `de`, `pt-BR`, `it`, `nl`, `pl`, `ru`, `uk`, `tr`, `sv-SE`, `ja`, `ko`, `zh-CN`, and `zh-TW`.
5. **No plain text messages**: Use internal embed templates (`this.medusa.embeds.success()`, `this.medusa.embeds.error()`, `this.medusa.embeds.warn()`).
6. **Hex colors only**: Always specify embed and theme colors as hex strings (e.g. `"#22c55e"`).
7. **Clean commits**: Commit all changes atomically with clear, conventional commit messages without co-author tags.

---

## Documentation

Full developer documentation and internal API specifications are available at:
[https://zerodev.ca/docs/medusa/developer-documentation](https://zerodev.ca/docs/medusa/developer-documentation)
