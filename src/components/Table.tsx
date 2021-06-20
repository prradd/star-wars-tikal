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

    useEffect (() => {
        const pilotSet = new Set();
        const setPilots = (resultsArr: Array<IVehicle>) => {
            resultsArr.map(pilotsArr => (
                pilotsArr.pilots.map(pilot => (
                    fetchData(pilot).then((data) => {
                        const result = data as IPeople;
                        const {name, url, homeworld, vehicles} = result;
                        pilotSet.add({name, url, homeworld, vehicles})
                    })
                ))
            ))
        }
        let count = 0;
        let next: string | null = SWAPI + "vehicles";
        while (next && count < 10) {
            fetchData(SWAPI + "vehicles")
                .then((data) => {
                    const result = data as IVehicles;
                    if (result.results.length > 0){
                        setPilots(result.results);
                    }
                    next = result.next;
                });
            count++
        };
        console.log(pilotSet);

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
