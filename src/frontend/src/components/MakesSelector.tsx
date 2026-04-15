import { useEffect, useState, useMemo, useCallback } from "react";
import { getMakes } from "@/lib/api";
import type { VehicleMake } from "@/lib/api";
import { useDashboard } from "./DashboardProvider";
import { SkeletonCard } from "./SkeletonCard";

const POPULAR_MAKES = [
    "TOYOTA", "HONDA", "FORD", "BMW", "MERCEDES-BENZ",
    "TESLA", "CHEVROLET", "NISSAN", "AUDI", "HYUNDAI",
];

const PAGE_SIZE = 60;

export function MakesSelector() {
    const { selectedMake, setMake, setTotalMakes } = useDashboard();
    const [makes, setMakes] = useState<VehicleMake[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    useEffect(() => {
        getMakes()
            .then(data => {
                setMakes(data);
                setTotalMakes(data.length);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [setTotalMakes]);

    const popularMakes = useMemo(() => {
        return POPULAR_MAKES.map(name =>
            makes.find(m => m.make_Name.toUpperCase() === name)
        ).filter(Boolean) as VehicleMake[];
    }, [makes]);

    const filtered = useMemo(() => {
        if (!searchTerm) return makes.slice(0, visibleCount);
        const lower = searchTerm.toLowerCase();
        return makes.filter(m => m.make_Name.toLowerCase().includes(lower)).slice(0, visibleCount);
    }, [makes, searchTerm, visibleCount]);

    const totalFiltered = useMemo(() => {
        if (!searchTerm) return makes.length;
        const lower = searchTerm.toLowerCase();
        return makes.filter(m => m.make_Name.toLowerCase().includes(lower)).length;
    }, [makes, searchTerm]);

    const selectMake = useCallback((m: VehicleMake) => {
        if ('vibrate' in navigator) navigator.vibrate(50);
        if (document.startViewTransition) {
            document.startViewTransition(() => setMake(m));
        } else {
            setMake(m);
        }
    }, [setMake]);

    const clearMake = useCallback(() => {
        if (document.startViewTransition) {
            document.startViewTransition(() => setMake(null));
        } else {
            setMake(null);
        }
    }, [setMake]);

    /* ─── Loading ─── */
    if (loading) {
        return (
            <div className="surface rounded-lg p-5">
                <div className="h-4 w-28 bg-muted rounded mb-4" />
                <div className="h-10 w-full bg-muted rounded-lg mb-4" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    <SkeletonCard count={8} className="h-10" />
                </div>
            </div>
        );
    }

    /* ─── Selected ─── */
    if (selectedMake) {
        return (
            <div className="surface rounded-lg p-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="shrink-0 w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Make</span>
                            <p className="text-base font-bold text-foreground truncate">{selectedMake.make_Name}</p>
                        </div>
                    </div>
                    <button
                        onClick={clearMake}
                        className="shrink-0 text-xs font-medium text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-md hover:bg-secondary border border-transparent hover:border-border transition-colors cursor-pointer"
                    >
                        Change
                    </button>
                </div>
            </div>
        );
    }

    /* ─── Selector ─── */
    return (
        <div className="surface rounded-lg p-5 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-baseline justify-between">
                <h2 className="text-sm font-bold text-foreground">Select a manufacturer</h2>
                <span className="text-[11px] text-muted-foreground tabular-nums">
                    {totalFiltered.toLocaleString()} results
                </span>
            </div>

            {/* Popular */}
            {!searchTerm && (
                <div className="flex flex-wrap gap-1.5">
                    {popularMakes.map(m => (
                        <button
                            key={m.make_ID}
                            onClick={() => selectMake(m)}
                            className="px-3 py-1.5 rounded-md bg-primary/8 hover:bg-primary/15 text-primary text-xs font-semibold transition-colors cursor-pointer border border-primary/15 hover:border-primary/30"
                        >
                            {m.make_Name}
                        </button>
                    ))}
                </div>
            )}

            {/* Search */}
            <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={e => { setSearchTerm(e.target.value); setVisibleCount(PAGE_SIZE); }}
                    className="w-full bg-background border border-border rounded-lg pl-9 pr-9 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all"
                />
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-muted text-muted-foreground cursor-pointer"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 max-h-[280px] overflow-y-auto">
                {filtered.map((m, i) => (
                    <button
                        key={m.make_ID}
                        onClick={() => selectMake(m)}
                        className="stagger-item text-left px-3 py-2 rounded-md bg-background hover:bg-secondary text-xs font-medium text-foreground/70 hover:text-foreground transition-colors cursor-pointer border border-border/60 hover:border-border truncate"
                        style={{ animationDelay: `${Math.min(i * 15, 400)}ms` }}
                    >
                        {m.make_Name}
                    </button>
                ))}
                {filtered.length === 0 && (
                    <div className="col-span-full py-8 text-center text-sm text-muted-foreground">
                        No manufacturers found.
                    </div>
                )}
            </div>

            {visibleCount < totalFiltered && (
                <button
                    onClick={() => setVisibleCount(v => v + PAGE_SIZE)}
                    className="self-center text-xs font-medium text-primary hover:text-primary/80 cursor-pointer transition-colors"
                >
                    Load more ↓
                </button>
            )}
        </div>
    );
}
