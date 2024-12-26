import { useState } from "react"

const PINS_KEY = "pins"

const restorePins = (): string[] => {
  const pinsJson = localStorage.getItem(PINS_KEY)
  if (pinsJson === null) return []

  try {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return JSON.parse(pinsJson) as string[]
  } catch {
    return []
  }
}

export const usePins = () => {
  const [pins, setPins] = useState<string[]>(restorePins())

  return {
    pins,
    addPin: (pin: string) => {
      const nextPins = [...pins, pin]
      localStorage.setItem("pins", JSON.stringify(nextPins))
      setPins(nextPins)
    },
    removePin: (pin: string) => {
      const nextPins = pins.filter((p) => p !== pin)
      localStorage.setItem("pins", JSON.stringify(nextPins))
      setPins(nextPins)
    },
    isPinned: (name: string) => pins.includes(name),
  }
}
