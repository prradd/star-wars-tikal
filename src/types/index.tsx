export interface IVehicle {
    name: string;
    pilots: Array<string> | [];
    url: string;
}

export interface IVehicles {
    count?: number;
    next: string | null;
    results: Array<IVehicle> | [];
}

export interface IPeople {
    name?: string;
    url: string;
    homeworld: string;
    vehicles?: Array<string>
}

export interface IPlanet {
    name?: string;
    url: string;
    population: string;
}

export interface IVehiclesResult {
    vehicleName: string;
    pilots: Array<string>;
    homePlanets: Array<{name: string; number: number;}>;
    homePlanetsSum: number;
}

export type FetchData =
    | IVehicles
    | IPeople
    | IPlanet