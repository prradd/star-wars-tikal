import React, {useEffect, useState} from 'react';
import {IPeople, IPlanet, IVehicle, IVehicles, IVehiclesResult} from "../types";
import {fetchData, mapPilots, mapPlanets, mapVehicles} from "./fetchSwapi";

const SWAPI = "https://swapi.dev/api/";

const Tables = () => {

    const [isLoaded, setIsLoaded] = useState(false);
    const [supVehicle, setSupVehicle] = useState<IVehiclesResult>({
        vehicleName: "",
        pilots: [],
        homePlanets: [],
        homePlanetsSum: 0
    })


    useEffect(() => {
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

        })().then(() => {
            // Calculate highest sum of "supporting" population
            for (const value of Array.from(vehiclesMap.values())) {
                console.log("value");
                console.log(value);
                let sum = 0;
                const pilots = value.pilots;
                for (let i = 0; i < pilots.length; i++) {
                    const homeWorldUrl = pilotsMap.get(pilots[i])?.homeworld;
                    let homeWorldPop = homeWorldUrl ? planetsMap.get(homeWorldUrl)?.population : 0;

                    if (typeof homeWorldPop === "string") {
                        homeWorldPop = homeWorldPop ? parseInt(homeWorldPop) : 0
                    }
                    sum += homeWorldPop ? homeWorldPop : 0;
                }
                if (sum > supVehicle.homePlanetsSum) {
                    setSupVehicle({
                        vehicleName: value.name,
                        pilots: pilots,
                        homePlanets: [],
                        homePlanetsSum: sum
                    })
                }
            }
            setIsLoaded(true);
            console.log(supVehicle);

        });


    }, [supVehicle])
    console.log(supVehicle);

    if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <div>
                {supVehicle.vehicleName}
            </div>
        );
    }
    ;
}

export default Tables