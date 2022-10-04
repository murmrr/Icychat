import { useEffect, useRef } from "react";
import moment from "moment";

export const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      tick();
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

export const convertTime = (bigTime) => {
  const utc = Number(bigTime) / 1000000;
  if (utc) {
    return moment(utc).format("h:mm a");
  }
  return utc;
};
