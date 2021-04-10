import { useState, useEffect } from "react";

const url = 'http://localhost:3001';

const useFetch = (endpoint, refetch = true) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(undefined);
    const [error, setError] = useState(undefined);
    const [fetchAgain, setFetchAgain] = useState(refetch);

    useEffect(() => {
        if (!endpoint) {
            setError('No endpoint');
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${url}/${endpoint}`);
                const data = await response.json();
                setData(data);
            } catch (error) {
                setError(error);
            }
            setLoading(false);
            setFetchAgain(false);
        };


        fetchData();


    }, [endpoint, fetchAgain]);

    return { loading, data, error, refetch: () => setFetchAgain(true) };
};

export default useFetch;