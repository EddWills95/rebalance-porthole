import { useState, useEffect, useCallback } from "react";

const url = `http://${process.env.REACT_APP_API_URL}`;

const useFetch = (endpoint) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(undefined);
    const [error, setError] = useState(undefined);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${url}/${endpoint}`);
            const data = await response.json();
            setData(data);
        } catch (error) {
            setError(error);
        }
        setLoading(false);
    }, [endpoint]);

    useEffect(() => {
        if (!endpoint) {
            setError('No endpoint');
            return;
        }

        fetchData();
    }, [endpoint, fetchData]);

    return { loading, data, error, refetch: fetchData };
};

export default useFetch;