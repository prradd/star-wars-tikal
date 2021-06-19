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

export interface People {
    name: string;
    url: string;
    homeworld: string;
}

export interface VehiclesResult {
    vehicleName: string;
    pilots: Array<string>;
    homePlanets: Array<{name: string; number: number;}>;
}

export type FetchData =
    | Vehicles
    | People