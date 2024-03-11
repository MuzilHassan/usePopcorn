import { useEffect, useState } from "react";

export const useLocalStorage = (initialState, Key) => {
  const [value, setValue] = useState(function () {
    const data = localStorage.getItem(Key);
    return data ? JSON.parse(data) : initialState;
  });

  useEffect(() => {
    localStorage.setItem("watched", JSON.stringify(value));
  }, [value, Key]);

  return [value, setValue];
};
