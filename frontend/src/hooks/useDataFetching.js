import { useState, useCallback } from 'react';

const useDataFetching = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (fetchFunction) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await fetchFunction();
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred while fetching data');
      setIsLoading(false);
      throw err;
    }
  }, []);

  return {
    isLoading,
    error,
    fetchData
  };
};

export default useDataFetching;
