import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { VehicleMake, VehicleType } from "@/lib/api";

interface DashboardState {
    selectedMake: VehicleMake | null;
    selectedYear: number | null;
    selectedType: VehicleType | null;
    totalMakes: number;
    setMake: (make: VehicleMake | null) => void;
    setYear: (year: number | null) => void;
    setType: (type: VehicleType | null) => void;
    setTotalMakes: (count: number) => void;
    currentStep: number;
}

const DashboardContext = createContext<DashboardState | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
    const [selectedMake, setSelectedMake] = useState<VehicleMake | null>(null);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [selectedType, setSelectedType] = useState<VehicleType | null>(null);
    const [totalMakes, setTotalMakes] = useState(0);

    const setMake = (make: VehicleMake | null) => {
        // Reset sub-selections when make changes
        if (selectedMake?.make_ID !== make?.make_ID) {
            setSelectedYear(null);
            setSelectedType(null);
        }
        setSelectedMake(make);
    };

    const setYear = (year: number | null) => {
        setSelectedYear(year);
    };

    const setType = (type: VehicleType | null) => {
        setSelectedType(type);
    };

    // Derive step from selections
    const currentStep = selectedMake
        ? selectedYear && selectedType
            ? 3
            : 2
        : 1;

    return (
        <DashboardContext.Provider value={{
            selectedMake, selectedYear, selectedType, totalMakes,
            setMake, setYear, setType, setTotalMakes, currentStep
        }}>
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard() {
    const context = useContext(DashboardContext);
    if (!context) throw new Error("useDashboard must be used within DashboardProvider");
    return context;
}
