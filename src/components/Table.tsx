import React, {useEffect, useState} from 'react';
import {FetchData, IPeople, IVehicle, IVehicles, IVehiclesResult} from "../types";

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

        const mapVehicles = (vehicles: Array<IVehicle> | []) => {
            vehicles.forEach((vehicle) => {
                if (vehicle.pilots.length > 0)
                    vehiclesMap.set(vehicle.url, {name: vehicle.name, pilots: vehicle.pilots})
            })
        }

        const mapPilots = (pilots: Array<string>) => {
            if (pilots.length > 0){
                pilots.map((pilotUrl: string) => {
                    const result: FetchData | string = await fetchData(pilotUrl); 
                })
            }

        }

        let next: string | null = SWAPI + "vehicles";
        (async () => {
            do {
                console.log(next);
                const result: FetchData | string = await fetchData(next);
                if (typeof result !== "string" && "results" in result) {
                    mapVehicles(result.results);
                }
                if (typeof result !== "string" && "next" in result) {
                    next = result.next;
                }
            } while (next !== null)
        })().then(() => {
            vehiclesMap.forEach((value, key) => {

            })
        });


        console.log(vehiclesMap);

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
