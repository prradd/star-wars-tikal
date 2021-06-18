import React, {useEffect, useState} from 'react';
import {FetchData, Vehicle, Vehicles, VehiclesResult} from "../types";

const Table = () => {
    const [error, setError] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);
    const [vehicles, setVehicles] = useState<Vehicles | []>([]);
    const [result, setResult] = useState<VehiclesResult | {}>({})

    const SWAPI = "http://localhost:5000/";

    const fetchData = async (url: string): Promise<FetchData | string> => {
        try {
            const res = await fetch(url);
            const data = await res.json();
            setIsLoaded(true);
            return data;
        } catch (err) {
            setError(err);
            return err;
        }
    }

    useEffect (() => {
        fetchData(SWAPI + "vehicles")
            .then(data => {
                if (Array.isArray(data)) {
                    console.log(data[0].url);
                    setVehicles(data[0].url);
                }
            });
    }, [])

    const VehiclesTable = fetchData(SWAPI + "vehicles")
        .then(data => {
            if (Array.isArray(data)) {
                console.log(data[0].url);
                return data[0].url;
            } else return null;
        });

    // do {
    //
    // } while (vehicles.next)

    if (error) {
        return <div>Error: {error}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <>
                {vehicles}
            </>
            // <div>{Array.isArray(vehicles) ? vehicles[0]
            //     : "null"} </div>
        );
    }
};

export default Table;
