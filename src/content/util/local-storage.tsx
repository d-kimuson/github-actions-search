import { createContext } from "preact"
import { useContext } from "preact/hooks"
import type { ComponentChildren, FunctionalComponent } from "preact"

export type Storage = Pick<
  globalThis.Storage,
  "getItem" | "setItem" | "removeItem" | "clear"
>

const LocalStorageContext = createContext<Storage>(localStorage)

type LocalStorageProviderProps = {
  children: ComponentChildren
  storage?: Storage
}

export const LocalStorageProvider: FunctionalComponent<
  LocalStorageProviderProps
> = ({ children, storage = localStorage }) => {
  return (
    <LocalStorageContext.Provider value={storage}>
      {children}
    </LocalStorageContext.Provider>
  )
}

export const useLocalStorage = () => {
  const storage = useContext(LocalStorageContext)
  return storage
}

export const inMemoryStorage = (): Storage => {
  const store = new Map<string, string>()
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => {
      store.set(key, value)
    },
    removeItem: (key) => {
      store.delete(key)
    },
    clear: () => {
      store.clear()
    },
  }
}
