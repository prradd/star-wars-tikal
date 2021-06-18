export interface Vehicle {
    name: string;
    pilots: Array<string> | [];
    url: string;
}

export interface Vehicles {
    count?: number;
    next?: string | null;
    previous?: string | null;
    results?: Array<Vehicle> | [];
}

export interface VehiclesResult {
    vehicleName: string;
    homePlanets: Array<{name: string; number: number;}>;
    pilots: Array<string>;
}

export type FetchData =
    | VehiclesResult