import {IPeople, IPlanet, IVehicle} from "../types";

export const fetchData: <T>(url: string) => Promise<T> = async (url: string) => {
    try {
        const res = await fetch(url);
        return await res.json();
    } catch (err) {
        return err;
    }
}

export const mapVehicles: (vehicles: Array<IVehicle>, mappedVehicles: Map<string, IVehicle>) => void =
    (vehicles, mappedVehicles) => {
        console.log(vehicles);
        return vehicles
            .filter(vehicle => vehicle.pilots.length > 0)
            .forEach(vehicle => mappedVehicles.set(vehicle.url, vehicle));
    }

export const mapPilots: (pilotUrls: Array<string>, mappedPilots: Map<string, IPeople>) => void =
    async (pilotUrls, mappedPilots) => {
        const promisedPilots = pilotUrls
            // remove already fetched pilots and pilots without url
            .filter(pilotUrl => !!pilotUrl?.length && !mappedPilots.has(pilotUrl))
            // Add promises
            .map(pilotUrl => fetchData<IPeople>(pilotUrl))

        // get all the pilots data
        const pilots = await Promise.all(promisedPilots);

        // Store pilots data
        pilots.forEach(pilot => mappedPilots.set(pilot.url, pilot))
    }

export const mapPlanets: (planetUrls: Array<string>, mappedPlanets: Map<string, IPlanet>) => void =
    async (planetUrls, mappedPlanets) => {
        const promisedPlanets = planetUrls
            // remove already fetched planets and planets without url
            .filter(planetUrl => !!planetUrl?.length && !mappedPlanets.has(planetUrl))
            // Add promises
            .map(planetUrl => fetchData<IPlanet>(planetUrl))

        // get all the planets data
        const planets = await Promise.all(promisedPlanets);

        // Store planet data
        planets.forEach(planet => mappedPlanets.set(planet.url, planet))
    }