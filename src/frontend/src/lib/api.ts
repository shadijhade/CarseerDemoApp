export interface VehicleMake {
    make_ID: number;
    make_Name: string;
}

export interface VehicleType {
    vehicleTypeId: number;
    vehicleTypeName: string;
}

export interface VehicleModel {
    make_ID: number;
    make_Name: string;
    model_ID: number;
    model_Name: string;
}

interface ApiResponse<T> {
    count: number;
    message: string;
    searchCriteria: string | null;
    results: T;
}

const API_BASE = import.meta.env.DEV ? "http://localhost:5055/api/vehicles" : "/api/vehicles";

export async function getMakes(): Promise<VehicleMake[]> {
    const response = await fetch(`${API_BASE}/makes`);
    if (!response.ok) throw new Error("Failed to fetch makes");
    const data: ApiResponse<VehicleMake[]> = await response.json();
    return data.results;
}

export async function getVehicleTypes(makeId: number): Promise<VehicleType[]> {
    const response = await fetch(`${API_BASE}/makes/${makeId}/types`);
    if (!response.ok) throw new Error("Failed to fetch vehicle types");
    const data: ApiResponse<VehicleType[]> = await response.json();
    return data.results;
}

export async function getModels(makeId: number, year: number, vehicleType?: string): Promise<VehicleModel[]> {
    let url = `${API_BASE}/makes/${makeId}/years/${year}/models`;
    if (vehicleType) {
        url += `?vehicleType=${encodeURIComponent(vehicleType)}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch models");
    // NHTSA model results sometimes come back as an array of objects
    const data: ApiResponse<VehicleModel[]> = await response.json();
    return data.results || [];
}
