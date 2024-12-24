import { useState } from "react";

const PINS_KEY = "pins";

const restorePins = (): string[] => {
  const pinsJson = localStorage.getItem(PINS_KEY);
  if (pinsJson === null) return [];

  try {
    return JSON.parse(pinsJson);
  } catch {
    return [];
  }
};

export const usePins = () => {
  const [pins, setPins] = useState<string[]>(restorePins());

  return {
    pins,
    addPin: (pin: string) => {
      const nextPins = [...pins, pin];
      localStorage.setItem("pins", JSON.stringify(nextPins));
      setPins(nextPins);
    },
    removePin: (pin: string) => {
      const nextPins = pins.filter((p) => p !== pin);
      localStorage.setItem("pins", JSON.stringify(nextPins));
      setPins(nextPins);
    },
    isPinned: (name: string) => pins.includes(name),
  };
};
