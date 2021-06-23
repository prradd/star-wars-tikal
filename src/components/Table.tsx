import React, {useEffect, useState} from 'react';
import {IPeople, IPlanet, IPlanets, IVehicle, IVehicles, IVehiclesResult} from "../types";
import {fetchData, mapPilots, mapPlanets, mapVehicles} from "./fetchSwapi";

import "../css/Tables.css";

const SWAPI = "https://swapi.dev/api/";

const Tables = () => {

    const [isLoaded, setIsLoaded] = useState(false);
    const [supVehicle, setSupVehicle] = useState<IVehiclesResult>()
    const [planets, setPlanets] = useState<IPlanets>()

    // Start with 5 planets from assignment
    const [startPlanets, setStartPlanets] = useState<IPlanets>()

    // Table data collection
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

            // Initiate chart of planets' own population
            const promisedPlanets: Promise<IPlanets>[] = ["Tatooine", "Alderaan", "Naboo", "Bespin", "Endor"]
                .map((planetName) => {
                    return fetchData<IPlanets>(SWAPI + "planets/?search=" + planetName);
                });
            const searchedPlanets = await Promise.all(promisedPlanets);
            const initPlanets = searchedPlanets.map(planet => planet.results[0]);

            setSupVehicle(tmpSum);
            setIsLoaded(true);
            setStartPlanets({
                next: SWAPI + "planets/?page=1",
                previous: null,
                results: initPlanets ? initPlanets : []
            })
        })();

    }, [])

    const handleClick = async (props: "next" | "previous") => {
        // Added option to iterate through rest of the planets
        const url = planets && !!planets[props] ? planets[props] : SWAPI + "planets/?page=1";
        const fetchedPlanets = await fetchData<IPlanets>(url as string);
        setPlanets(fetchedPlanets);
    }

    const Chart = () => {
        const shownPlanets = planets ? planets : startPlanets;
        const width = planets ? "9%" : "19%";
        return (
            <>
                {
                    shownPlanets?.results ? shownPlanets.results.map((planet, key) => {
                            const height = planet.population !== "unknown" ? parseInt(planet.population) / 10000000 : 0;
                            return (
                                <div
                                    className="chart-bar"
                                    key={key}
                                    style={{
                                        width,
                                        height: height,
                                        maxHeight: "100%",
                                        minHeight: height === 0 ? "1%" : "5%"
                                    }}
                                >
                                    <p>{planet.population}</p>
                                    <div
                                        className="bar"
                                    />
                                    <p>{planet.name}</p>
                                </div>
                            )
                        })
                        : null
                }
            </>
        )
    }

    if (!isLoaded) {
        return <div>Loading...</div>;
    } else if (!supVehicle) {
        return <div>Nothing to show...</div>
    } else {
        return (
            <>
                <div className="table-responsive">
                    <h3>The vehicle with largest population behind their pilots</h3>
                    <div className="grid">
                        <span>Vehicle name with the largest supporting population</span>
                        <span>{supVehicle.vehicleName}</span>
                        <span>Related home planets and their population</span>
                        <span>{supVehicle.homePlanets.map((planet, key) =>
                            <p key={key}>{planet ? `${planet.name}: ${planet.population}` : null}</p>
                        )}</span>
                        <span>Related pilot names</span>
                        <span>
                            {supVehicle.pilots.map((pilot, key) =>
                                <p key={key}>{pilot}</p>)}
                        </span>
                    </div>

                </div>
                <h3>Chart of home planets' own population</h3>
                <div className="chart">
                    <button
                        className="btn left"
                        onClick={() => handleClick("previous")}
                    >
                        &#60;
                    </button>
                    <Chart />
                    <button
                        className="btn right"
                        onClick={() => handleClick("next")}
                    >
                        &#62;
                    </button>
                </div>
            </>
        );
    }

    ;
}

export default Tables