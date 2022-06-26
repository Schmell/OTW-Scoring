import { useState } from "preact/hooks";

const useArray = (initialValue = []) => {
  const [value, setValue] = useState(initialValue as any);

  const push = (element) => {
    setValue((oldValue) => [...oldValue, element]);
  };

  const remove = (index) => {
    setValue((oldValue) => oldValue.filter((_, i) => i !== index));
  };

  const isEmpty = () => value.length === 0;

  return { value, setValue, push, remove, isEmpty };
};

export default useArray;
