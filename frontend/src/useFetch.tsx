import { useState, useEffect } from 'react';

type Method = 'GET' | 'PUT' | 'DELETE';

interface UseFetchProps {
  url: string;
  method: Method;
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
}

const useFetch = ({ url, method, body, headers }: UseFetchProps) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body: JSON.stringify(body),
        });

        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url, method, body, headers]);

  return { data, error, isLoading };
};

export default useFetch;