import React, { createContext, useContext, useState, useEffect } from "react";

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [time, setTime] = useState({ minutes: 0, seconds: 0 });
  const [isRunning, setIsRunning] = useState(false);

  const startTimer = (startTime) => {
    const [minutes, seconds] = startTime.split(":").map(Number);
    setTime({ minutes, seconds });
    setIsRunning(true);
  };

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          let { minutes, seconds } = prevTime;

          if (seconds === 59) {
            minutes += 1;
            seconds = 0;
          } else {
            seconds += 1;
          }

          return { minutes, seconds };
        });
      }, 1000);
    } else if (!isRunning && interval) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const stopTimer = () => setIsRunning(false);

  const formatTime = () => {
    const minutes = time.minutes < 10 ? `0${time.minutes}` : time.minutes;
    const seconds = time.seconds < 10 ? `0${time.seconds}` : time.seconds;
    return `${minutes}:${seconds}`;
  };

  return (
    <TimerContext.Provider
      value={{ time, formatTime, startTimer, stopTimer, isRunning }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);
