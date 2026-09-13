# Medusa Module Template

The official module starter template for [Medusa](https://zerodev.ca), developed by Zero Development.

This repository provides a production-ready, batteries-included template for building custom Medusa modules. It demonstrates every subsystem, including database models, Discord commands, HTTP API routes, background clocks, dashboard schemas, audit logging, multi-language localization, automation flow nodes, and leaderboard providers.

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
│   │   └── settings.js
│   ├── dashboard/               # Custom dashboard views (Pages)
│   │   └── pages/
│   │       └── template/
│   │           └── page.js
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
    │   └── template.js
    ├── events/                  # Discord gateway event listeners (Events)
    │   └── messageCreate.js
    ├── handlers/                # Core business logic and model calls (Handlers)
    │   └── Items.js
    ├── models/                  # PostgreSQL database tables (Models)
    │   └── Item.js
    └── routes/                  # Internal HTTP API endpoints (Routes)
        └── items/
            └── route.js
```

---

## Core Building Blocks

| Subsystem | Folder | Base Class | Description |
| --- | --- | --- | --- |
| **Module** | `main.js` | `Modules` | Module declaration, startup/shutdown hooks, and permissions. |
| **Models** | `src/models/` | `Models` | PostgreSQL tables with Sequelize, automatic migrations, and CRUD. |
| **Handlers** | `src/handlers/` | `Handlers` | Reusable business logic, validation, and cross-module calls. |
| **Commands** | `src/commands/` | `Commands` | Discord slash and prefix commands with options and autocomplete. |
| **Events** | `src/events/` | `Events` | Discord gateway event listeners. |
| **Clocks** | `src/clocks/` | `Clocks` | Scheduled recurring cron tasks. |
| **Routes** | `src/routes/` | `Routes` | HTTP endpoints mounted at `/api/modules/<module><path>`. |
| **Config** | `resources/config/` | `Configs` | Schema-driven settings forms in the web dashboard. |
| **Logs** | `resources/logs/` | `Logs` | Discord channel audit logging streams. |
| **Langs** | `resources/lang/` | `Langs` | Multi-language phrases and embed templates across 16 locales. |
| **Pages** | `resources/dashboard/pages/` | `Pages` | Dedicated custom tabs and views in the dashboard. |
| **Leaderboards** | `resources/leaderboards/` | `Leaderboards` | Custom ranking providers for Discord and web leaderboards. |
| **Nodes** | `resources/nodes/` | `Nodes` | Interactive nodes for visual automation flows. |
| **Docs** | `resources/docs/` | Markdown / MDX | In-dashboard documentation viewer. |

---

## Architecture Rules

When developing official or commercial Medusa modules, follow these architecture standards:

1. **No comments in code**: Write clean, self-describing code without inline comments.
2. **Strict architecture**: Place business logic in `handlers/`, database queries in `models/`, and interactions in `commands/` or `routes/`.
3. **No optionals or fallbacks**: Avoid optional chaining (`?.`), nullish coalescing (`??`), and logical OR value fallbacks (`||`). Use explicit condition checks.
4. **All 16 languages supported**: Provide translation dictionaries across `en`, `fr`, `es-ES`, `de`, `pt-BR`, `it`, `nl`, `pl`, `ru`, `uk`, `tr`, `sv-SE`, `ja`, `ko`, `zh-CN`, and `zh-TW`.
5. **No plain text messages**: Use internal embed templates (`this.medusa.embeds.success()`, `this.medusa.embeds.error()`, `this.medusa.embeds.warn()`).
6. **Hex colors only**: Always specify embed and theme colors as hex strings (e.g. `"#22c55e"`).
7. **Clean commits**: Commit all changes atomically with clear, conventional commit messages.

---

## Documentation

Full developer documentation and internal API specifications are available at:
[https://zerodev.ca/docs/medusa/developer-documentation](https://zerodev.ca/docs/medusa/developer-documentation)
