import { useState } from "react"
import * as v from "valibot"
import { useLocalStorage } from "@/content/util/local-storage"

const PINS_KEY = "pins"

const pinStoreSchema = v.array(v.string())

const parseStore = (pinsJson: string | null): string[] => {
  if (pinsJson === null) return []

  try {
    return v.parse(pinStoreSchema, JSON.parse(pinsJson))
  } catch {
    return []
  }
}

export const usePins = () => {
  const storage = useLocalStorage()
  const [pins, setPins] = useState<string[]>(
    parseStore(storage.getItem(PINS_KEY))
  )

  return {
    pins,
    addPin: (pin: string) => {
      const nextPins = [...pins, pin]
      storage.setItem("pins", JSON.stringify(nextPins))
      setPins(nextPins)
    },
    removePin: (pin: string) => {
      const nextPins = pins.filter((p) => p !== pin)
      storage.setItem("pins", JSON.stringify(nextPins))
      setPins(nextPins)
    },
    isPinned: (name: string) => pins.includes(name),
  }
}
