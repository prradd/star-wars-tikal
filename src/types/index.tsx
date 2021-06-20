export interface IVehicle {
    name: string;
    pilots: Array<string> | [];
    url: string;
}

export interface IVehicles {
    count?: number;
    next: string | null;
    previous?: string | null;
    results: Array<IVehicle> | [];
}

export interface IPeople {
    name?: string;
    url?: string;
    homeworld?: string;
    vehicles?: Array<string>
}

export interface IVehiclesResult {
    vehicleName: string;
    pilots: Array<string>;
    homePlanets: Array<{name: string; number: number;}>;
}

export type FetchData =
    | IVehicles
    | IPeople