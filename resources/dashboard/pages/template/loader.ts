import type { ModuleLoader } from "@/components/pages/types";
import { medusa } from "@/lib/medusa";

const loader: ModuleLoader = async (module) => {
    try {
        const data = await medusa.moduleData(module, "/items");
        return { available: true, data };
    } catch {
        return {
            available: true,
            data: {
                items: [],
                stats: { total: 0, active: 0, categories: 0 }
            }
        };
    }
};

export default loader;
