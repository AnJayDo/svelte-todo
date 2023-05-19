import { browser } from '$app/environment';

/**
 * Get value from localStorage if in browser and the value is stored, otherwise fallback
 * @param {string} storageKey
 * @param {any} fallbackValue
 */
export function fromLocalStorage(storageKey, fallbackValue) {
  if (browser) {
    const storedValue = window.localStorage.getItem(storageKey);
    if (storedValue !== 'undefined' && storedValue !== null) {
      return typeof fallbackValue === 'object'
        ? JSON.parse(storedValue)
        : storedValue;
    }
  }

  return fallbackValue;
}

/**
 * Set value to localStorage if in browser and the value is stored, otherwise fallback
 * @param {any} store
 * @param {string} storageKey
 */
export function toLocalStorage(store, storageKey) {
	if (browser) {
		store?.subscribe(value => {
			let storageValue = (typeof value === 'object') 
				? JSON.stringify(value)
				: value
				
			window.localStorage.setItem(storageKey, storageValue)
		})
	}
}