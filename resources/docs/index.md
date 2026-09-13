---
title: "Template Module Guide"
description: "Overview, commands, and configuration guide for the template module."
icon: "home"
order: 1
---

# Template Module

Welcome to the **Template Module** for Medusa. This module demonstrates the official architecture and all runtime building blocks.

## Core Features

- **Database Models**: Automated PostgreSQL table synchronization with Sequelize.
- **Discord Commands**: Slash command integration with subcommands, options, and autocomplete.
- **HTTP Routes**: Authenticated REST API endpoints mounted under `/api/modules/template`.
- **Dashboard Schemas**: Declarative settings forms with channel, role, and toggle selectors.
- **Audit Logging**: Structured event logging dispatched to dedicated Discord channels.
- **Multi-Language Support**: Full localization across all 16 supported Medusa languages.
- **Automation Flow Nodes**: Custom actions and conditions for the automation engine.
- **Leaderboards**: Custom ranking providers integrated into `/leaderboard` and the dashboard.

## Commands

| Command | Usage | Description |
| --- | --- | --- |
| `/template list` | `/template list` | Displays all registered items in the server. |
| `/template create` | `/template create <identifier> <name> [quantity] [price]` | Creates a new item record. |
| `/template delete` | `/template delete <identifier>` | Removes an existing item record. |

## Configuration

Navigate to **Modules > Configurations > Template Settings** in the Medusa dashboard to customize operational options, alert channels, and staff roles.
