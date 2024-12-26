import { createContext, useContext } from "react"
import type { FC, PropsWithChildren } from "react"

export type InjectableStorage = Pick<
  Storage,
  "getItem" | "setItem" | "removeItem" | "clear"
>

export const inMemoryStorage = () => {
  const store = new Map<string, string>()

  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key, value) => {
      store.set(key, value)
    },
    removeItem: (key) => {
      store.delete(key)
    },
    clear: () => {
      store.clear()
    },
  } satisfies InjectableStorage
}

const StorageContext = createContext<InjectableStorage>(inMemoryStorage())

export const LocalStorageProvider: FC<
  PropsWithChildren<{
    storage?: InjectableStorage
  }>
> = ({ children, storage }) => {
  return (
    <StorageContext.Provider value={storage ?? localStorage}>
      {children}
    </StorageContext.Provider>
  )
}

export const useLocalStorage = () => {
  const storage = useContext(StorageContext)
  return storage
}
