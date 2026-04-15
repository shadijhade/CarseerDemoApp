import { useEffect, useState } from "react";
import { getVehicleTypes, type VehicleType } from "@/lib/api";
import { useDashboard } from "./DashboardProvider";

export function YearTypeSelector() {
    const { selectedMake, selectedYear, selectedType, setYear, setType } = useDashboard();
    const [types, setTypes] = useState<VehicleType[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!selectedMake) return;
        setLoading(true);
        getVehicleTypes(selectedMake.make_ID)
            .then(data => setTypes(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [selectedMake]);

    if (!selectedMake) return null;

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 30 }, (_, i) => currentYear - i); // Last 30 years

    const handleSelect = (setter: any, value: any) => {
        if ('vibrate' in navigator) navigator.vibrate(50);
        if(document.startViewTransition) {
            document.startViewTransition(() => setter(value));
        } else {
            setter(value);
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 fill-mode-both">
            {/* Year Selector */}
            <div className="glass-panel p-5 rounded-2xl flex-1 flex flex-col gap-3">
                <div className="flex justify-between items-center px-1">
                    <span className="text-sm text-white/50 font-medium">Model Year</span>
                    {selectedYear && (
                        <button onClick={() => handleSelect(setYear, null)} className="text-xs text-primary hover:text-primary/80 uppercase font-bold tracking-wider cursor-pointer">Change</button>
                    )}
                </div>
                
                {selectedYear ? (
                    <div className="text-3xl font-heading text-white px-1">
                        {selectedYear}
                    </div>
                ) : (
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                        {years.map(y => (
                            <button
                                key={y}
                                onClick={() => handleSelect(setYear, y)}
                                className="px-3 py-2 rounded-lg bg-white/5 hover:bg-primary/20 text-white/80 hover:text-white text-sm font-medium transition-all cursor-pointer border border-transparent hover:border-primary/50"
                            >
                                {y}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Type Selector */}
            <div className={`glass-panel p-5 rounded-2xl flex-1 flex flex-col gap-3 ${!selectedYear ? 'opacity-50 pointer-events-none' : 'transition-opacity duration-300'}`}>
                <div className="flex justify-between items-center px-1">
                    <span className="text-sm text-white/50 font-medium">Vehicle Type</span>
                    {selectedType && (
                        <button onClick={() => handleSelect(setType, null)} className="text-xs text-primary hover:text-primary/80 uppercase font-bold tracking-wider cursor-pointer">Change</button>
                    )}
                </div>

                {loading ? (
                    <div className="animate-pulse h-10 w-full bg-primary/20 rounded-lg mt-2" />
                ) : selectedType ? (
                    <div className="text-2xl font-heading text-white px-1 truncate" title={selectedType.vehicleTypeName}>
                        {selectedType.vehicleTypeName}
                    </div>
                ) : (
                    <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                        <button
                            onClick={() => handleSelect(setType, { vehicleTypeId: 0, vehicleTypeName: 'Any Type' })}
                            className="text-left px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-all cursor-pointer"
                        >
                            Any Type
                        </button>
                        {types.map(t => (
                            <button
                                key={t.vehicleTypeId}
                                onClick={() => handleSelect(setType, t)}
                                className="text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-primary/20 text-white/80 hover:text-white text-sm font-medium transition-all cursor-pointer border border-transparent hover:border-primary/50"
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
