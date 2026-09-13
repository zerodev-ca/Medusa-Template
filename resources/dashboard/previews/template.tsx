"use client";

import { useMemo } from "react";
import { Sparkles, Box, Check, MessageSquare, Bell } from "lucide-react";
import type { PreviewProps } from "@/components/pages/types";

export default function TemplateConfigPreview({ values, user }: PreviewProps) {
    const accentColor = useMemo(() => {
        if (typeof values.embedColor === "string" && values.embedColor.trim()) {
            return values.embedColor.trim();
        }
        return "#5865f2";
    }, [values.embedColor]);

    const prefix = typeof values.channelPrefix === "string" && values.channelPrefix.trim()
        ? values.channelPrefix.trim()
        : "template-";

    const maxItems = typeof values.maxItemsPerUser === "number"
        ? values.maxItemsPerUser
        : 10;

    const enabled = values.enabled !== false;
    const notifications = values.notificationsEnabled === true;
    const username = user && user.name ? user.name : "Server Member";

    return (
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-xs">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Box className="size-4" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Live Config Preview</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full" style={{ backgroundColor: enabled ? "#22c55e" : "#ef4444" }} />
                    <span className="text-xs font-medium text-muted-foreground">{enabled ? "Active" : "Disabled"}</span>
                </div>
            </div>

            <div className="flex flex-col gap-3 rounded-xl border border-border/80 bg-background/50 p-3.5">
                <div className="flex items-start gap-3">
                    <div className="size-9 shrink-0 rounded-full border border-border bg-muted/60" style={{ backgroundColor: accentColor }} />
                    <div className="flex flex-1 flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">{username}</span>
                            <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">BOT</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Previewing live template configurations. Channel prefix is set to <code className="rounded-md bg-muted px-1 py-0.5 font-mono text-[11px] text-foreground">{prefix}#</code> with maximum <strong className="text-foreground">{maxItems}</strong> items allowed per member.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-2 rounded-lg border-l-4 bg-muted/30 p-3" style={{ borderLeftColor: accentColor }}>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground">Template Automation Panel</span>
                        <Sparkles className="size-3.5" style={{ color: accentColor }} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Interactive Discord message components and live configurations will broadcast through configured notification channels.
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                        <span className="inline-flex items-center gap-1 rounded-md bg-background px-2 py-0.5 text-[10px] font-medium border border-border">
                            <Bell className="size-3 text-muted-foreground" />
                            <span>Notifications: {notifications ? "Enabled" : "Muted"}</span>
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-md bg-background px-2 py-0.5 text-[10px] font-medium border border-border">
                            <MessageSquare className="size-3 text-muted-foreground" />
                            <span>Prefix: {prefix}</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
