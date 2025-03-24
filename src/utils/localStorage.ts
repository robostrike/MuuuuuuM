import { useEffect, useState } from 'react'; // Added missing useState import

const LOCAL_STORAGE_KEY = 'gridConfig';

export const saveGridConfig = (config: Record<string, any>) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
};

export const loadGridConfig = (): Record<string, any> | null => {
  const config = localStorage.getItem(LOCAL_STORAGE_KEY);
  return config ? JSON.parse(config) : null;
};

export const useLocalStorage = <T extends Record<string, any>>(initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(() => {
    const storedValue = loadGridConfig();
    return storedValue !== null ? (storedValue as T) : initialValue;
  });

  useEffect(() => {
    saveGridConfig(value);
  }, [value]);

  return [value, setValue];
};