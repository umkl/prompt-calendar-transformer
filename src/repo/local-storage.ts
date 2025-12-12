export function retrieveMapFromLocalStorage(key: string): Map<string, string> {
  const map = new Map<string, string>();
  const storedData = localStorage.getItem(key);
  if (storedData) {
    try {
      const parsedData = JSON.parse(storedData);
      for (const [k, v] of Object.entries(parsedData)) {
        map.set(k, v as string);
      }
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
    }
  }
  return map;
}

export function storeMapToLocalStorage(key: string, map: Map<string, string>): void {
  const obj: { [key: string]: string } = {};
  map.forEach((value, mapKey) => {
    obj[mapKey] = value;
  });
  try {
    localStorage.setItem(key, JSON.stringify(obj));
  } catch (error) {
    console.error("Error storing data to localStorage:", error);
  }
};

export function pushItemToMapInLocalStorage(key: string, itemKey: string, itemValue: string): void {
  const map = retrieveMapFromLocalStorage(key);
  map.set(itemKey, itemValue);
  storeMapToLocalStorage(key, map);
}

export function storeObjectInLocalStorage(key: string, obj: object): void {
  localStorage.setItem(key, JSON.stringify(obj));
}

export function retrieveObjectFromLocalStorage<T extends object>(key: string): T {
  const localStorageContent = localStorage.getItem(key);
  if (!localStorageContent) {
    throw new Error("No data found in localStorage for key: " + key);
  }
  return JSON.parse(localStorageContent) as T;
}