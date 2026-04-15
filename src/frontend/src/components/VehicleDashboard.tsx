import { DashboardProvider } from "./DashboardProvider";
import { MakesSelector } from "./MakesSelector";
import { YearTypeSelector } from "./YearTypeSelector";
import { ModelsGallery } from "./ModelsGallery";

export function VehicleDashboard() {
    return (
        <DashboardProvider>
            <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
                <main className="w-full max-w-5xl flex flex-col gap-6">
                    {/* Header */}
                    <header className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
                        <h1 className="text-4xl md:text-5xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-white mb-2">
                            Vehicle Explorer
                        </h1>
                        <p className="text-white/60 font-medium">
                            Browse the National Highway Traffic Safety Administration database.
                        </p>
                    </header>
                    
                    <div className="flex flex-col gap-6 w-full">
                        <MakesSelector />
                        <YearTypeSelector />
                        <ModelsGallery />
                    </div>
                </main>
            </div>
        </DashboardProvider>
    );
}
