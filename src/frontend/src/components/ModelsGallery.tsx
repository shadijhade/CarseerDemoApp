import { useEffect, useState } from "react";
import { getModels, type VehicleModel } from "@/lib/api";
import { useDashboard } from "./DashboardProvider";

export function ModelsGallery() {
    const { selectedMake, selectedYear, selectedType } = useDashboard();
    const [models, setModels] = useState<VehicleModel[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!selectedMake || !selectedYear || !selectedType) return;
        
        setLoading(true);
        // If "Any Type" is selected, it has vehicleTypeId 0, so we just don't pass the type string
        const typeStr = selectedType.vehicleTypeId === 0 ? undefined : selectedType.vehicleTypeName;
        
        getModels(selectedMake.make_ID, selectedYear, typeStr)
            .then(data => setModels(data))
            .catch(console.error)
            .finally(() => setLoading(false));
            
    }, [selectedMake, selectedYear, selectedType]);

    if (!selectedMake || !selectedYear || !selectedType) return null;

    return (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 fill-mode-both mt-4">
            <h2 className="text-xl font-heading text-white flex items-center gap-2">
                Available Models
                <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                    {models.length}
                </span>
            </h2>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[1,2,3,4,5,6,7,8].map(i => (
                        <div key={i} className="glass-panel h-32 rounded-2xl animate-pulse bg-white/5" />
                    ))}
                </div>
            ) : models.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {models.map(m => (
                        <div 
                            key={m.model_ID} 
                            className="glass-panel p-5 rounded-2xl flex flex-col justify-center gap-2 hover:bg-white/10 hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300 cursor-default group border border-white/5 hover:border-primary/50"
                        >
                            <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold group-hover:text-primary transition-colors">
                                {m.make_Name}
                            </span>
                            <h3 className="text-lg font-medium text-white truncate" title={m.model_Name}>
                                {m.model_Name}
                            </h3>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="glass-panel p-12 rounded-2xl text-center flex flex-col items-center justify-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"></path></svg>
                    </div>
                    <div>
                        <p className="text-white font-medium">No Models Found</p>
                        <p className="text-sm text-white/50">Try selecting a different year or type.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
