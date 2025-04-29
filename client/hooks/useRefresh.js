import { useState, useCallback } from 'react';

export const useRefresh = () => {
  const [refreshCounter, setRefreshCounter] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshCounter(prev => prev + 1);
  }, []);

  return { refreshCounter, triggerRefresh };
};