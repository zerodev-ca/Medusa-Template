"use client";

import { useState, useMemo } from "react";
import {
    Search,
    Plus,
    Trash2,
    Edit,
    RefreshCw,
    Box,
    Layers,
    Activity,
    CheckCircle2,
    SlidersHorizontal,
    ExternalLink,
    FolderPlus,
    X
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import type { ViewProps } from "@/components/pages/types";

type ItemRecord = {
    identifier: string;
    name: string;
    category: string;
    quantity: number;
    price: number;
    enabled: boolean;
};

type ItemForm = {
    identifier: string;
    name: string;
    category: string;
    quantity: number;
    price: number;
    enabled: boolean;
};

const DEFAULT_ITEMS: ItemRecord[] = [
    {
        identifier: "item_starter_pack",
        name: "Starter Bundle",
        category: "bundles",
        quantity: 50,
        price: 9.99,
        enabled: true
    },
    {
        identifier: "item_vip_pass",
        name: "VIP Membership",
        category: "membership",
        quantity: 120,
        price: 19.99,
        enabled: true
    },
    {
        identifier: "item_cosmetic_skin",
        name: "Neon Glow Trail",
        category: "cosmetics",
        quantity: 15,
        price: 4.99,
        enabled: false
    },
    {
        identifier: "item_booster_gem",
        name: "XP Multiplier Gem",
        category: "boosters",
        quantity: 80,
        price: 2.50,
        enabled: true
    }
];

const CATEGORY_OPTIONS = [
    { value: "all", label: "All Categories" },
    { value: "bundles", label: "Bundles" },
    { value: "membership", label: "Membership" },
    { value: "cosmetics", label: "Cosmetics" },
    { value: "boosters", label: "Boosters" }
];

const STATUS_OPTIONS = [
    { value: "all", label: "All Statuses" },
    { value: "active", label: "Active" },
    { value: "disabled", label: "Disabled" }
];

const SORT_OPTIONS = [
    { value: "name", label: "Sort: Name" },
    { value: "quantity", label: "Sort: Stock Count" },
    { value: "price", label: "Sort: Price" }
];

const FORM_CATEGORIES = [
    { value: "bundles", label: "Bundles" },
    { value: "membership", label: "Membership" },
    { value: "cosmetics", label: "Cosmetics" },
    { value: "boosters", label: "Boosters" }
];

export default function TemplateView({ data }: ViewProps) {
    const initialItems = useMemo(() => {
        if (Array.isArray(data)) return data as ItemRecord[];
        if (data && typeof data === "object" && "items" in data && Array.isArray((data as { items: unknown }).items)) {
            return (data as { items: ItemRecord[] }).items;
        }
        return DEFAULT_ITEMS;
    }, [data]);

    const [items, setItems] = useState<ItemRecord[]>(initialItems);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortOrder, setSortOrder] = useState("name");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingIdentifier, setEditingIdentifier] = useState<string | null>(null);
    const [discordButtonStatus, setDiscordButtonStatus] = useState("Idle");
    const [discordSelectValue, setDiscordSelectValue] = useState("starter");

    const [formData, setFormData] = useState<ItemForm>({
        identifier: "",
        name: "",
        category: "bundles",
        quantity: 1,
        price: 0,
        enabled: true
    });

    const filteredItems = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        return items
            .filter(item => {
                if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
                if (statusFilter === "active" && !item.enabled) return false;
                if (statusFilter === "disabled" && item.enabled) return false;
                if (!query) return true;
                return item.name.toLowerCase().includes(query) || item.identifier.toLowerCase().includes(query);
            })
            .sort((a, b) => {
                switch (sortOrder) {
                    case "quantity":
                        return b.quantity - a.quantity;
                    case "price":
                        return b.price - a.price;
                    default:
                        return a.name.localeCompare(b.name);
                }
            });
    }, [items, searchQuery, categoryFilter, statusFilter, sortOrder]);

    const stats = useMemo(() => {
        const totalItems = items.length;
        const activeItems = items.filter(item => item.enabled).length;
        const totalStock = items.reduce((sum, item) => sum + item.quantity, 0);
        const categories = new Set(items.map(item => item.category)).size;
        return { totalItems, activeItems, totalStock, categories };
    }, [items]);

    function openCreateModal() {
        setEditingIdentifier(null);
        setFormData({
            identifier: `item_${Date.now().toString().slice(-6)}`,
            name: "",
            category: "bundles",
            quantity: 10,
            price: 5.00,
            enabled: true
        });
        setModalOpen(true);
    }

    function openEditModal(item: ItemRecord) {
        setEditingIdentifier(item.identifier);
        setFormData({
            identifier: item.identifier,
            name: item.name,
            category: item.category,
            quantity: item.quantity,
            price: item.price,
            enabled: item.enabled
        });
        setModalOpen(true);
    }

    function saveItem() {
        if (!formData.name.trim() || !formData.identifier.trim()) return;
        if (editingIdentifier) {
            setItems(items.map(item => (item.identifier === editingIdentifier ? { ...formData } : item)));
        } else {
            setItems([...items, { ...formData }]);
        }
        setModalOpen(false);
    }

    function deleteItem(identifier: string) {
        setItems(items.filter(item => item.identifier !== identifier));
    }

    function toggleItem(identifier: string) {
        setItems(items.map(item => (item.identifier === identifier ? { ...item, enabled: !item.enabled } : item)));
    }

    function resetToDefaults() {
        setItems(DEFAULT_ITEMS);
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="flex items-center gap-4 p-5">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Box className="size-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-muted-foreground">Total Items</span>
                            <span className="text-2xl font-bold tracking-tight">{stats.totalItems}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center gap-4 p-5">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                            <CheckCircle2 className="size-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-muted-foreground">Active Items</span>
                            <span className="text-2xl font-bold tracking-tight">{stats.activeItems}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center gap-4 p-5">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                            <Layers className="size-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-muted-foreground">Total Stock</span>
                            <span className="text-2xl font-bold tracking-tight">{stats.totalStock}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center gap-4 p-5">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                            <Activity className="size-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-muted-foreground">Categories</span>
                            <span className="text-2xl font-bold tracking-tight">{stats.categories}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="p-4">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                            <Button variant="default" size="default" onClick={openCreateModal} className="h-9 gap-2">
                                <Plus className="size-4" />
                                <span>Create Item</span>
                            </Button>
                            <Button variant="secondary" size="default" onClick={resetToDefaults} className="h-9 gap-2">
                                <RefreshCw className="size-4" />
                                <span>Reset Mock</span>
                            </Button>
                            <Button variant="outline" size="default" className="h-9 gap-2">
                                <SlidersHorizontal className="size-4" />
                                <span>Batch Action</span>
                            </Button>
                            <Button variant="destructive" size="default" onClick={() => setItems(items.filter(item => item.enabled))} className="h-9 gap-2">
                                <Trash2 className="size-4" />
                                <span>Purge Disabled</span>
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={searchQuery}
                                onChange={event => setSearchQuery(event.target.value)}
                                placeholder="Search by name or slug"
                                className="h-9 pl-9 text-sm"
                            />
                        </div>
                        <Select
                            value={categoryFilter}
                            onValueChange={setCategoryFilter}
                            options={CATEGORY_OPTIONS}
                            className="h-9 text-sm"
                        />
                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                            options={STATUS_OPTIONS}
                            className="h-9 text-sm"
                        />
                        <Select
                            value={sortOrder}
                            onValueChange={setSortOrder}
                            options={SORT_OPTIONS}
                            className="h-9 text-sm"
                        />
                    </div>
                </div>
            </Card>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3">Identifier</th>
                                <th className="px-4 py-3">Display Name</th>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3">Stock Count</th>
                                <th className="px-4 py-3">Unit Price</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center gap-2">
                                            <Box className="size-8 text-muted-foreground/60" />
                                            <span className="text-sm font-medium">No items found</span>
                                            <span className="text-xs">Adjust your search criteria or register a new item.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map(item => (
                                    <tr key={item.identifier} className="hover:bg-muted/30">
                                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{item.identifier}</td>
                                        <td className="px-4 py-3 font-medium text-foreground">{item.name}</td>
                                        <td className="px-4 py-3">
                                            <Badge className={cn("text-xs font-medium capitalize", item.category === "bundles" ? "bg-purple-500/15 text-purple-500" : item.category === "membership" ? "bg-amber-500/15 text-amber-500" : item.category === "cosmetics" ? "bg-blue-500/15 text-blue-500" : "bg-emerald-500/15 text-emerald-500")}>
                                                {item.category}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 font-medium">{item.quantity}</td>
                                        <td className="px-4 py-3 font-mono text-xs">${item.price.toFixed(2)}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Switch checked={item.enabled} onCheckedChange={() => toggleItem(item.identifier)} />
                                                <span className="text-xs text-muted-foreground">{item.enabled ? "Active" : "Disabled"}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="inline-flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="sm" onClick={() => openEditModal(item)} className="h-8 w-8 p-0" title="Edit Item">
                                                    <Edit className="size-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => deleteItem(item.identifier)} className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10" title="Delete Item">
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Card className="p-5">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-base font-semibold tracking-tight">Discord Component Preview</h3>
                        <p className="text-xs text-muted-foreground">Interactive preview demonstrating message buttons and select menus matching Discord Gateway interactions.</p>
                    </div>

                    <div className="flex flex-col gap-4 rounded-xl border border-border/80 bg-muted/20 p-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                variant="default"
                                size="default"
                                onClick={() => setDiscordButtonStatus("Primary Clicked")}
                                className="h-9 gap-2 bg-[#5865f2] text-white hover:bg-[#4752c4]"
                            >
                                <span>Primary Action</span>
                            </Button>
                            <Button
                                variant="secondary"
                                size="default"
                                onClick={() => setDiscordButtonStatus("Secondary Clicked")}
                                className="h-9 gap-2 bg-[#4e5058] text-white hover:bg-[#383a40]"
                            >
                                <span>Secondary</span>
                            </Button>
                            <Button
                                variant="default"
                                size="default"
                                onClick={() => setDiscordButtonStatus("Success Clicked")}
                                className="h-9 gap-2 bg-[#23a55a] text-white hover:bg-[#1a7f45]"
                            >
                                <span>Confirm / Success</span>
                            </Button>
                            <Button
                                variant="destructive"
                                size="default"
                                onClick={() => setDiscordButtonStatus("Danger Clicked")}
                                className="h-9 gap-2 bg-[#da373c] text-white hover:bg-[#a1282c]"
                            >
                                <span>Delete / Danger</span>
                            </Button>
                            <a
                                href="https://zerodev.ca"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-medium hover:bg-muted"
                            >
                                <span>External Link</span>
                                <ExternalLink className="size-3.5 text-muted-foreground" />
                            </a>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <Select
                                value={discordSelectValue}
                                onValueChange={setDiscordSelectValue}
                                options={[
                                    { value: "starter", label: "Select Item: Starter Pack" },
                                    { value: "vip", label: "Select Item: VIP Membership" },
                                    { value: "skin", label: "Select Item: Neon Trail" }
                                ]}
                                className="h-9 text-sm"
                            />
                            <div className="flex h-9 items-center justify-between rounded-lg border border-border bg-background px-3 text-xs">
                                <span className="text-muted-foreground">Last Discord Action:</span>
                                <span className="font-mono font-medium text-foreground">{discordButtonStatus}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingIdentifier ? "Edit Template Item" : "Create Template Item"}
                description="Configure the properties, pricing, stock count, and active status for this item."
            >
                <div className="flex flex-col gap-4 pt-2">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Item Identifier</label>
                        <Input
                            value={formData.identifier}
                            disabled={Boolean(editingIdentifier)}
                            onChange={event => setFormData({ ...formData, identifier: event.target.value })}
                            placeholder="e.g. item_premium_pass"
                            className="h-9 font-mono text-sm"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Display Name</label>
                        <Input
                            value={formData.name}
                            onChange={event => setFormData({ ...formData, name: event.target.value })}
                            placeholder="e.g. Premium Season Pass"
                            className="h-9 text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</label>
                            <Select
                                value={formData.category}
                                onValueChange={value => setFormData({ ...formData, category: value })}
                                options={FORM_CATEGORIES}
                                className="h-9 text-sm"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stock Count</label>
                            <Input
                                type="number"
                                value={formData.quantity.toString()}
                                onChange={event => {
                                    const parsed = parseInt(event.target.value, 10);
                                    setFormData({ ...formData, quantity: Number.isNaN(parsed) ? 0 : parsed });
                                }}
                                className="h-9 text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Unit Price ($)</label>
                            <Input
                                type="number"
                                step="0.01"
                                value={formData.price.toString()}
                                onChange={event => {
                                    const parsed = parseFloat(event.target.value);
                                    setFormData({ ...formData, price: Number.isNaN(parsed) ? 0 : parsed });
                                }}
                                className="h-9 text-sm"
                            />
                        </div>

                        <div className="flex flex-col justify-end gap-1.5">
                            <div className="flex h-9 items-center justify-between rounded-lg border border-border px-3">
                                <span className="text-xs font-medium">Status</span>
                                <Switch
                                    checked={formData.enabled}
                                    onCheckedChange={checked => setFormData({ ...formData, enabled: checked })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-3 pt-2">
                        <Button variant="outline" size="default" onClick={() => setModalOpen(false)} className="h-9 w-full">
                            Cancel
                        </Button>
                        <Button variant="default" size="default" onClick={saveItem} className="h-9 w-full">
                            Save Item
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
