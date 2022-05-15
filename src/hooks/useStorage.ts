import { useState, useCallback, useEffect } from "react";

/**
 * Similar to `useState` but with some lightweight behind-the-scenes
 * writing to localStorage; also subscribes to changes in localStorage
 *
 * @param {string} key The string key name to be written to localStorage
 * @param {object} options
 * @param {*} options.initialValue Initial value for setState
 * @param {boolean} options.bool Treat values as boolean types
 * @returns
 */
type useStorageProps = {
  key: string;
  options: useStorageOptions;
};
type useStorageOptions = {
  initialValue: any | null;
  bool: boolean;
};
const useStorage = (key: string, options: useStorageOptions) => {
  const [value, setValue] = useState(options.initialValue);

  useEffect(() => {
    const rawValue = window.localStorage.getItem(key);
    if (rawValue != null)
      setValue(options.bool ? parseRawValue(rawValue) : rawValue);

    const handleChanges = (e) => {
      if (e.key === key) {
        setValue(options.bool ? parseRawValue(e.newValue) : e.newValue);
      }
    };

    window.addEventListener("storage", handleChanges);

    return () => {
      window.removeEventListener("storage", handleChanges);
    };
  }, [key, options.bool]);

  const updater = useCallback(
    (newValue) => {
      setValue(newValue);
      window.localStorage.setItem(key, newValue);
    },
    [key]
  );

  return [value, updater];
};

export default useStorage;

const parseRawValue = (rawValue) =>
  rawValue === "true" || rawValue === "1"
    ? true
    : rawValue === "false" || rawValue === "0"
    ? false
    : rawValue;
