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
    count?: number;
    message?: string;
    searchCriteria?: string | null;
    results?: T;
    Count?: number;
    Message?: string;
    SearchCriteria?: string | null;
    Results?: T;
}

const API_BASE = import.meta.env.DEV ? "http://localhost:5055/api/vehicles" : "/api/vehicles";

export async function getMakes(): Promise<VehicleMake[]> {
    const response = await fetch(`${API_BASE}/makes`);
    if (!response.ok) throw new Error("Failed to fetch makes");
    const data: ApiResponse<any> = await response.json();
    const results = data.results || data.Results || [];
    return results.map((m: any) => ({
        make_ID: m.make_ID || m.Make_ID,
        make_Name: m.make_Name || m.Make_Name
    }));
}

export async function getVehicleTypes(makeId: number): Promise<VehicleType[]> {
    const response = await fetch(`${API_BASE}/makes/${makeId}/types`);
    if (!response.ok) throw new Error("Failed to fetch vehicle types");
    const data: ApiResponse<any> = await response.json();
    const results = data.results || data.Results || [];
    return results.map((t: any) => ({
        vehicleTypeId: t.vehicleTypeId || t.VehicleTypeId,
        vehicleTypeName: t.vehicleTypeName || t.VehicleTypeName
    }));
}

export async function getModels(makeId: number, year: number, vehicleType?: string): Promise<VehicleModel[]> {
    let url = `${API_BASE}/makes/${makeId}/years/${year}/models`;
    if (vehicleType) {
        url += `?vehicleType=${encodeURIComponent(vehicleType)}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch models");
    // NHTSA model results sometimes come back as an array of objects
    const data: ApiResponse<any> = await response.json();
    const results = data.results || data.Results || [];
    return results.map((m: any) => ({
        make_ID: m.make_ID || m.Make_ID,
        make_Name: m.make_Name || m.Make_Name,
        model_ID: m.model_ID || m.Model_ID,
        model_Name: m.model_Name || m.Model_Name
    }));
}
