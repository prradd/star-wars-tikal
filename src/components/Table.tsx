import React, {useEffect, useState} from 'react';
import {FetchData, IPeople, IPlanet, IVehicle, IVehicles, IVehiclesResult} from "../types";

const SWAPI = "https://swapi.dev/api/";

const Tables = () => {

    const [error, setError] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);

    const fetchData = async (url: string): Promise<FetchData | string> => {
        try {
            const res = await fetch(url);
            const data = await res.json();
            return data;
        } catch (err) {
            setError(err);
            return err;
        }
    }

    useEffect(() => {
        const vehiclesMap = new Map();
        const pilotsMap = new Map();
        const planetsMap = new Map();

        const mapVehicles = (vehicles: Array<IVehicle> | []) => {
            vehicles.forEach((vehicle) => {
                if (vehicle.pilots.length > 0)
                    vehiclesMap.set(vehicle.url, {name: vehicle.name, pilots: vehicle.pilots})
            })
        }

        const mapPilots = (pilots: Array<string>) => {
            if (pilots.length > 0){
                pilots.map(async (pilotUrl: string) => {
                    const result: FetchData | string = await fetchData(pilotUrl) as IPeople;
                    if (typeof result !== "string" && "homeworld" in result) {
                        const {name, url, homeworld} = result;
                        pilotsMap.set(url, {name, homeworld});
                    }
                })
            }
        }

        const mapPlanets = async (planetUrl: string) => {
            console.log(planetUrl);
            const result: FetchData | string = await fetchData(planetUrl) as IPlanet;
            if (typeof result !== "string" && "population" in result) {
                const {name, url, population} = result;
                planetsMap.set(url, {name, population});
            }
        }

        let next: string | null = SWAPI + "vehicles";
        (async () => {
            do {
                const result: FetchData | string = await fetchData(next);
                if (typeof result !== "string" && "results" in result) {
                    mapVehicles(result.results);
                }
                if (typeof result !== "string" && "next" in result) {
                    next = result.next;
                }
            } while (next !== null)
        })().then(() => {
            vehiclesMap.forEach((value) => {
                mapPilots(value.pilots);
            });
        }).then(() => {
            pilotsMap.forEach((value) => {
                console.log(value);
                mapPlanets(value.homeworld).then(() => {});
            });
        });

        console.log(vehiclesMap);
        console.log(pilotsMap);
        console.log(planetsMap);

    }, [])


    if (error) {
        return <div>Error: {error}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <>
                {/*{Array.isArray(vehicles.results) ? vehicles.results[0].url : null}*/}
            </>
        );
    }
};

export default Tables;
