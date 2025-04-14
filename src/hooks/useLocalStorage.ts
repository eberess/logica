import { useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // État pour stocker notre valeur
  // Passe la fonction d'initialisation à useState pour que la logique ne s'exécute qu'une seule fois
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Retourne une version enveloppée de la fonction setState de useState qui ...
  // ... persiste la nouvelle valeur dans localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permet à la valeur d'être une fonction pour que nous ayons la même API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Sauvegarde l'état
      setStoredValue(valueToStore);
      
      // Sauvegarde dans localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
} 