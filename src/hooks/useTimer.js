import { useState, useEffect } from 'react';

export const useTimer = (initialTime, onComplete) => {
  const [timer, setTimer] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setIsActive(false);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timer, onComplete]);

  const start = () => {
    setTimer(initialTime);
    setIsActive(true);
  };

  const reset = () => {
    setTimer(initialTime);
    setIsActive(false);
  };

  return { timer, start, reset, isActive };
};
