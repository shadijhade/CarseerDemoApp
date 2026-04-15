import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { VehicleMake, VehicleType } from "@/lib/api";

interface DashboardState {
    selectedMake: VehicleMake | null;
    selectedYear: number | null;
    selectedType: VehicleType | null;
    setMake: (make: VehicleMake | null) => void;
    setYear: (year: number | null) => void;
    setType: (type: VehicleType | null) => void;
}

const DashboardContext = createContext<DashboardState | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
    const [selectedMake, setSelectedMake] = useState<VehicleMake | null>(null);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [selectedType, setSelectedType] = useState<VehicleType | null>(null);

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

    return (
        <DashboardContext.Provider value={{
            selectedMake, selectedYear, selectedType,
            setMake, setYear, setType
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
