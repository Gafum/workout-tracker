// --- Generic localStorage Helper Functions ---

/**
 * Retrieves an item from localStorage and parses it as JSON.
 * @param key The key of the item to retrieve.
 * @param defaultValue The default value to return if the item is not found or an error occurs.
 * @returns The parsed item or the default value.
 */
export const getItemFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
      return JSON.parse(storedValue) as T;
    }
  } catch (error) {
    console.error(`Error loading item "${key}" from localStorage:`, error);
  }
  return defaultValue;
};

/**
 * Saves an item to localStorage after stringifying it.
 * @param key The key under which to save the item.
 * @param value The value to save.
 * @returns True if saving was successful, false otherwise.
 */
export const setItemInLocalStorage = <T>(key: string, value: T): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error saving item "${key}" to localStorage:`, error);
    return false;
  }
};