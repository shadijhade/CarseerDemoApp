import { useEffect, useState, useCallback, useRef } from "react";
import { getVehicleTypes } from "@/lib/api";
import type { VehicleType } from "@/lib/api";
import { useDashboard } from "./DashboardProvider";
import { SkeletonCard } from "./SkeletonCard";

export function YearTypeSelector() {
    const { selectedMake, selectedYear, selectedType, setYear, setType } = useDashboard();
    const [types, setTypes] = useState<VehicleType[]>([]);
    const [loading, setLoading] = useState(false);
    const yearScrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!selectedMake) return;
        setLoading(true);
        getVehicleTypes(selectedMake.make_ID)
            .then(data => setTypes(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [selectedMake]);

    const handleSelect = useCallback((setter: (v: any) => void, value: any) => {
        if ('vibrate' in navigator) navigator.vibrate(50);
        if (document.startViewTransition) {
            document.startViewTransition(() => setter(value));
        } else {
            setter(value);
        }
    }, []);

    if (!selectedMake) return null;

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 35 }, (_, i) => currentYear - i);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* ─── Year ─── */}
            <div className="surface rounded-lg p-4 flex flex-col gap-3 min-w-0">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-foreground">Model Year</span>
                    {selectedYear && (
                        <button
                            onClick={() => handleSelect(setYear, null)}
                            className="text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                        >
                            Change
                        </button>
                    )}
                </div>

                {selectedYear ? (
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-extrabold text-foreground tabular-nums">{selectedYear}</span>
                    </div>
                ) : (
                    <div
                        ref={yearScrollRef}
                        className="flex flex-wrap gap-1.5 max-h-[160px] overflow-y-auto"
                    >
                        {years.map((y, i) => (
                            <button
                                key={y}
                                onClick={() => handleSelect(setYear, y)}
                                className="stagger-item px-3 py-1.5 rounded-md bg-background hover:bg-secondary text-xs font-semibold text-foreground/70 hover:text-foreground transition-colors cursor-pointer border border-border/60 hover:border-border tabular-nums"
                                style={{ animationDelay: `${Math.min(i * 15, 300)}ms` }}
                            >
                                {y}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* ─── Type ─── */}
            <div className={`surface rounded-lg p-4 flex flex-col gap-3 transition-opacity duration-200 ${!selectedYear ? 'opacity-40 pointer-events-none' : ''}`}>
                <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-foreground">Vehicle Type</span>
                    {selectedType && (
                        <button
                            onClick={() => handleSelect(setType, null)}
                            className="text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                        >
                            Change
                        </button>
                    )}
                </div>

                {!selectedYear && (
                    <p className="text-xs text-muted-foreground">Select a year first.</p>
                )}

                {selectedYear && loading && (
                    <div className="flex flex-col gap-1.5">
                        <SkeletonCard count={3} className="h-9" />
                    </div>
                )}

                {selectedYear && !loading && selectedType && (
                    <span className="text-lg font-bold text-foreground truncate" title={selectedType.vehicleTypeName}>
                        {selectedType.vehicleTypeName}
                    </span>
                )}

                {selectedYear && !loading && !selectedType && (
                    <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto">
                        <button
                            onClick={() => handleSelect(setType, { vehicleTypeId: 0, vehicleTypeName: 'All Types' })}
                            className="text-left px-3 py-2 rounded-md bg-primary/8 hover:bg-primary/15 text-primary text-xs font-semibold transition-colors cursor-pointer border border-primary/15"
                        >
                            All Types
                        </button>
                        {types.map((t, i) => (
                            <button
                                key={t.vehicleTypeId}
                                onClick={() => handleSelect(setType, t)}
                                className="stagger-item text-left px-3 py-2 rounded-md bg-background hover:bg-secondary text-xs font-medium text-foreground/70 hover:text-foreground transition-colors cursor-pointer border border-border/60 hover:border-border"
                                style={{ animationDelay: `${(i + 1) * 40}ms` }}
                            >
                                {t.vehicleTypeName}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
