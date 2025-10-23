import { useState, useEffect } from 'react';

export function useClapiers() {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => { setData([]); }, []);
  return { data, loading: false, refresh: () => {} };
}
