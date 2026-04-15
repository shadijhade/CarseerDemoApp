import { useEffect, useState, useMemo } from "react";
import { getMakes, type VehicleMake } from "@/lib/api";
import { useDashboard } from "./DashboardProvider";

export function MakesSelector() {
    const { selectedMake, setMake } = useDashboard();
    const [makes, setMakes] = useState<VehicleMake[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        getMakes()
            .then(data => {
                setMakes(data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        if (!searchTerm) return makes.slice(0, 50);
        const lower = searchTerm.toLowerCase();
        return makes.filter(m => m.make_Name.toLowerCase().includes(lower)).slice(0, 50);
    }, [makes, searchTerm]);

    if (loading) {
         return <div className="animate-pulse h-12 w-full bg-primary/20 rounded-xl" />;
    }

    if (selectedMake) {
        return (
            <div className="flex items-center justify-between p-4 glass-panel rounded-2xl animate-in fade-in zoom-in duration-300">
                <div>
                    <span className="text-xs text-primary font-bold uppercase tracking-wider block mb-1">Make</span>
                    <h3 className="text-2xl font-heading text-white">{selectedMake.make_Name}</h3>
                </div>
                <button 
                    onClick={() => {
                        if(document.startViewTransition) {
                            document.startViewTransition(() => setMake(null));
                        } else {
                            setMake(null);
                        }
                    }}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                   <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
        );
    }

    return (
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-xl font-heading text-white font-medium">Select a Make</h2>
                <p className="text-sm text-white/50">Search from thousands of manufacturers.</p>
            </div>
            
            <input 
                type="text" 
                placeholder="Search e.g. Toyota, Tesla..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {filtered.map(m => (
                    <button
                        key={m.make_ID}
                        onClick={() => {
                            if ('vibrate' in navigator) navigator.vibrate(50);
                            if(document.startViewTransition) {
                                document.startViewTransition(() => setMake(m));
                            } else {
                                setMake(m);
                            }
                        }}
                        className="text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-primary/20 hover:border-primary/50 border border-transparent transition-all cursor-pointer truncate text-sm font-medium text-white/80 hover:text-white"
                    >
                        {m.make_Name}
                    </button>
                ))}
                {filtered.length === 0 && (
                    <div className="col-span-full py-8 text-center text-white/40">No makes found.</div>
                )}
            </div>
        </div>
    );
}
