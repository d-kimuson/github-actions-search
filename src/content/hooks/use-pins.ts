import { useState } from "react"
import * as v from "valibot"
import { useLocalStorage } from "@/content/util/local-storage"

const createPinsKey = (owner: string, repo: string) => `pins:${owner}/${repo}`

const pinStoreSchema = v.array(v.string())

const parseStore = (pinsJson: string | null): string[] => {
  if (pinsJson === null) return []

  try {
    return v.parse(pinStoreSchema, JSON.parse(pinsJson))
  } catch {
    return []
  }
}

type UsePinsOptions = {
  owner: string
  repo: string
}

export const usePins = ({ owner, repo }: UsePinsOptions) => {
  const storage = useLocalStorage()
  const pinsKey = createPinsKey(owner, repo)
  const [pins, setPins] = useState<string[]>(
    parseStore(storage.getItem(pinsKey))
  )

  return {
    pins,
    addPin: (pin: string) => {
      const nextPins = [...pins, pin]
      storage.setItem(pinsKey, JSON.stringify(nextPins))
      setPins(nextPins)
    },
    removePin: (pin: string) => {
      const nextPins = pins.filter((p) => p !== pin)
      storage.setItem(pinsKey, JSON.stringify(nextPins))
      setPins(nextPins)
    },
    isPinned: (name: string) => pins.includes(name),
  }
}
