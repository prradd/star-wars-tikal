import React, { useEffect, useState } from 'react';
import { IPeople, IPlanet, IVehicle, IVehicles } from "../types";

const SWAPI = "https://swapi.dev/api/";

const Tables = () => {

    const [error, setError] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);

    const fetchData: <T>(url: string) => Promise<T> = async (url: string) => {
        try {
            const res = await fetch(url);
            return await res.json();
        } catch (err) {
            setError(err);
            return err;
        }
    }

    useEffect(() => {
        const vehiclesMap = new Map<string, IVehicle>();
        const pilotsMap = new Map<string, IPeople>();
        const planetsMap = new Map<string, IPlanet>();

        const mapVehicles: (vehicles: Array<IVehicle>, mappedVehicles: Map<string, IVehicle>) => void =
            (vehicles, mappedVehicles) => {
                return vehicles
                    .filter(vehicle => !!vehicle.pilots.length)
                    .forEach( vehicle => mappedVehicles.set(vehicle.url, vehicle));
            }

        const mapPilots: (pilotUrls: Array<string>, mappedPilots: Map<string, IPeople>) => void =
            async (pilotUrls, mappedPilots ) => {
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

        const mapPlanets: (planetUrls: Array<string>, mappedPlanets: Map<string, IPlanet>) => void =
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


        (async () => {
            let next: string | null = SWAPI + "vehicles";
            do {
                const result: IVehicles = await fetchData<IVehicles>(next);
                mapVehicles(result.results, vehiclesMap);
                next = result.next;
            } while (next !== null)

            for (const value of Array.from(vehiclesMap.values())) {
                await mapPilots(value.pilots, pilotsMap);
            }

            for (const value of Array.from(pilotsMap.values())) {
                mapPlanets([value.homeworld], planetsMap);
            }

        })().then();

        console.log(vehiclesMap);
        console.log(pilotsMap);
        console.log(planetsMap);

    }, [])


    if (error) {
        return <div>Error: { error }</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <>
                {/*{Array.isArray(vehicles.results) ? vehicles.results[0].url : null}*/ }
            </>
        );
    }
};

export default Tables;