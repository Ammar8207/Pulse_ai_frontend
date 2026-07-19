import { useEffect, useState } from 'react';
import apiClient from '../api/axios';

export default function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get(url);
        if (active) {
          setData(response.data);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (url) {
      fetchData();
    }

    return () => {
      active = false;
    };
  }, [url]);

  return { data, loading, error };
}
