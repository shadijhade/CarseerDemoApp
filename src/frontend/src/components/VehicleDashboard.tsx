import { DashboardProvider, useDashboard } from "./DashboardProvider";
import { HeroHeader } from "./HeroHeader";
import { StepIndicator } from "./StepIndicator";
import { MakesSelector } from "./MakesSelector";
import { YearTypeSelector } from "./YearTypeSelector";
import { ModelsGallery } from "./ModelsGallery";

function DashboardContent() {
    const { totalMakes, currentStep } = useDashboard();

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-6">
                <HeroHeader totalMakes={totalMakes} />
                <StepIndicator currentStep={currentStep} />

                <div className="flex flex-col gap-3 pb-12">
                    <MakesSelector />
                    <YearTypeSelector />
                    <ModelsGallery />
                </div>
            </div>

            <footer className="border-t border-border py-4">
                <div className="max-w-4xl mx-auto px-4 md:px-6 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="font-semibold text-foreground">Carseer</span>
                    <span>
                        Data from{" "}
                        <a
                            href="https://vpic.nhtsa.dot.gov/api/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-2 hover:text-foreground transition-colors"
                        >
                            NHTSA vPIC
                        </a>
                    </span>
                </div>
            </footer>
        </div>
    );
}

export function VehicleDashboard() {
    return (
        <DashboardProvider>
            <DashboardContent />
        </DashboardProvider>
    );
}
