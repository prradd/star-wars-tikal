import React, {useEffect, useState} from 'react';
import {FetchData, IPeople, IVehicle, IVehicles, IVehiclesResult} from "../types";

const SWAPI = "https://swapi.dev/api/";

const Table = () => {

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

        let next: string | null = SWAPI + "vehicles";


        while (next !== null) {
            const result = fetchData(SWAPI + "vehicles").then((result) => {
                if (typeof result !== "string" && "results" in result) {
                    mapVehicles(result.results);
                    if (result.next)
                        next = result.next;
                }
            })
        }


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

export default Table;
