import React, {useEffect, useState} from 'react';
import {FetchData, Vehicle, Vehicles, VehiclesResult} from "../types";

const Table = () => {
    const [error, setError] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);
    const [vehicles, setVehicles] = useState<Vehicles>({});
    // const [result, setResult] = useState<VehiclesResult | {}>({})

    const SWAPI = "https://swapi.dev/api/";

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

    const pilotSet = new Set();

    const setPilots = (resultsArr: Array<Vehicle>) => {
        resultsArr.map(pilotsArr => {
            pilotsArr.pilots.map(pilot => {
                fetchData(pilot).then((res) => {

                })
                console.log(pilot);
                pilotSet.add(pilot)
            })
        })
    }

    useEffect (() => {
        fetchData(SWAPI + "vehicles")
            .then((data) => {
                const results = data as Vehicles;
                if (Array.isArray(results.results)){
                    setPilots(results.results);
                    console.log(pilotSet);
                }

            });
    }, [])

    console.log(pilotSet);

    if (error) {
        return <div>Error: {error}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <>
                {Array.isArray(vehicles.results) ? vehicles.results[0].url : null}
            </>
        );
    }
};

export default Table;
