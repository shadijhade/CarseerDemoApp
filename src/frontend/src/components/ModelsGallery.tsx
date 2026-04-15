import { useEffect, useState, useMemo } from "react";
import { getModels } from "@/lib/api";
import type { VehicleModel } from "@/lib/api";
import { useDashboard } from "./DashboardProvider";
import { AnimatedCounter } from "./AnimatedCounter";
import { SkeletonCard } from "./SkeletonCard";

type SortOption = "a-z" | "z-a";

export function ModelsGallery() {
    const { selectedMake, selectedYear, selectedType } = useDashboard();
    const [models, setModels] = useState<VehicleModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [sort, setSort] = useState<SortOption>("a-z");
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (!selectedMake || !selectedYear || !selectedType) return;

        setLoading(true);
        setSearch("");
        const typeStr = selectedType.vehicleTypeId === 0 ? undefined : selectedType.vehicleTypeName;

        getModels(selectedMake.make_ID, selectedYear, typeStr)
            .then(data => setModels(data))
            .catch(console.error)
            .finally(() => setLoading(false));

    }, [selectedMake, selectedYear, selectedType]);

    const processed = useMemo(() => {
        let list = [...models];
        if (search) {
            const lower = search.toLowerCase();
            list = list.filter(m => m.model_Name.toLowerCase().includes(lower));
        }
        list.sort((a, b) =>
            sort === "a-z"
                ? a.model_Name.localeCompare(b.model_Name)
                : b.model_Name.localeCompare(a.model_Name)
        );
        return list;
    }, [models, sort, search]);

    if (!selectedMake || !selectedYear || !selectedType) return null;

    return (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300 mt-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-baseline gap-2">
                    <h2 className="text-sm font-bold text-foreground">Models</h2>
                    {!loading && (
                        <span className="text-xs text-muted-foreground tabular-nums">
                            <AnimatedCounter target={processed.length} duration={400} /> found
                        </span>
                    )}
                </div>

                {!loading && models.length > 0 && (
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Filter..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="bg-background border border-border rounded-md pl-7 pr-3 py-1 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring/30 w-36 transition-all"
                            />
                        </div>
                        <button
                            onClick={() => setSort(s => s === "a-z" ? "z-a" : "a-z")}
                            className="px-2.5 py-1 rounded-md bg-background border border-border text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer tabular-nums"
                        >
                            {sort === "a-z" ? "A→Z" : "Z→A"}
                        </button>
                    </div>
                )}
            </div>

            {/* Loading */}
            {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    <SkeletonCard count={8} className="h-20" />
                </div>
            )}

            {/* Grid */}
            {!loading && processed.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {processed.map((m, i) => (
                        <div
                            key={m.model_ID}
                            className="stagger-item surface p-4 rounded-lg flex flex-col gap-1 hover:bg-secondary/50 transition-colors cursor-default group"
                            style={{ animationDelay: `${Math.min(i * 30, 500)}ms` }}
                        >
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold group-hover:text-primary transition-colors">
                                {m.make_Name}
                            </span>
                            <span className="text-sm font-semibold text-foreground truncate" title={m.model_Name}>
                                {m.model_Name}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty */}
            {!loading && processed.length === 0 && (
                <div className="surface p-10 rounded-lg text-center">
                    <p className="text-sm font-medium text-foreground">No models found</p>
                    <p className="text-xs text-muted-foreground mt-1">
                        {search ? "Try a different filter." : "Try a different year or type."}
                    </p>
                </div>
            )}
        </div>
    );
}
