import React, {useEffect, useState} from 'react';
import {IPeople, IPlanet, IVehicle, IVehicles, IVehiclesResult} from "../types";
import {fetchData, mapPilots, mapPlanets, mapVehicles} from "./fetchSwapi";

import "../css/Table.css";

const SWAPI = "https://swapi.dev/api/";

const Tables = () => {

    const [isLoaded, setIsLoaded] = useState(false);
    const [supVehicle, setSupVehicle] = useState<IVehiclesResult>()


    useEffect(() => {
        let tmpSum: IVehiclesResult = {
            vehicleName: "",
            pilots: [],
            homePlanets: [],
            homePlanetsSum: 0
        };

        const calcMaxSum: (vehicle: IVehicle) => void = (vehicle) => {
            let sum = 0;
            const pilots = vehicle.pilots;
            for (let i = 0; i < pilots.length; i++) {
                const homeWorldUrl = pilotsMap.get(pilots[i])?.homeworld;
                let homeWorldPop = homeWorldUrl ? planetsMap.get(homeWorldUrl)?.population : 0;

                if (typeof homeWorldPop === "string") {
                    homeWorldPop = homeWorldPop ? parseInt(homeWorldPop) : 0
                }
                sum += homeWorldPop ? homeWorldPop : 0;
            }

            if (sum > tmpSum.homePlanetsSum) {
                const homePlanets: Array<IPlanet | null> = pilots.map((pilot) =>
                    pilotsMap.get(pilot)?.homeworld)
                    .map((planetUrl) => {
                        if (planetUrl) {
                            const planet = planetsMap.get(planetUrl)
                            return planet ? planet : null;
                        }
                        return null;
                    });

                tmpSum = {
                    vehicleName: vehicle.name,
                    pilots: pilots.map((pilot) => pilotsMap.get(pilot)?.name || ""),
                    homePlanets: homePlanets,
                    homePlanetsSum: sum
                }
            }
        }

        const vehiclesMap = new Map<string, IVehicle>();
        const pilotsMap = new Map<string, IPeople>();
        const planetsMap = new Map<string, IPlanet>();

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
                await mapPlanets([value.homeworld], planetsMap);
            }

            // Calculate highest sum of "supporting" population
            for (const value of Array.from(vehiclesMap.values())) {
                await calcMaxSum(value);
            }

            setSupVehicle(tmpSum);
            setIsLoaded(true);

        })();

    }, [])


    if (!isLoaded) {
        return <div>Loading...</div>;
    } else if (!supVehicle) {
        return <div>Nothing to show...</div>
    } else {
        return (
            <div className="table-responsive">
                <h3>The vehicle with largest population behind their pilots</h3>
                <div className="grid">
                    <span>Vehicle name with the largest supporting population</span>
                    <span>{supVehicle.vehicleName}</span>
                    <span>Related home planets and their population</span>
                    <span>{supVehicle.homePlanets.map((planet) =>
                        <p>{planet ? `${planet.name}: ${planet.population}` : null}</p>
                    )}</span>
                    <span>Related pilot names</span>
                    <span>{supVehicle.pilots.map((pilot) => <p>{pilot}</p>)}</span>
                </div>
            </div>
        );
    }

    ;
}

export default Tables