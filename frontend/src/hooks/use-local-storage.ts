import { useState, useEffect, useCallback } from 'react';

// ----------------------------------------------------------------------

export const AOAI_CREDENTIAL_KEY = 'gbb-ai-aoai-resources';
export const AOAI_STORAGE_CONFIG = 'gbb-ai-aoai-configurations';

// ----------------------------------------------------------------------

export function useLocalStorage(key: string, initialState: any) {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const restored = getStorage(key);

    if (restored) {
      setState((prevValue: any) => ({
        ...prevValue,
        ...restored,
      }));
    }
  }, [key]);

  const updateState = useCallback(
    (updateValue: any) => {
      setState((prevValue: any) => {
        setStorage(key, {
          ...prevValue,
          ...updateValue,
        });

        return {
          ...prevValue,
          ...updateValue,
        };
      });
    },
    [key]
  );

  const update = useCallback(
    (name: string, updateValue: any) => {
      updateState({
        [name]: updateValue,
      });
    },
    [updateState]
  );

  const reset = useCallback(() => {
    removeStorage(key);
    setState(initialState);
  }, [initialState, key]);

  return {
    state,
    update,
    reset,
  };
}

// ----------------------------------------------------------------------

export const getStorage = (key: string) => {
  let value = null;

  try {
    const result = window.localStorage.getItem(key);

    if (result) {
      value = JSON.parse(result);
    }
  } catch (error) {
    console.error(error);
  }

  return value;
};

export const setStorage = (key: string, value: any) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const removeStorage = (key: string) => {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
