const STORAGE_PREFIX = 'kazilink.'

type StoredValue<T> = {
  value: T
  expiresAt?: number
}

function getStorage(): Storage | null {
  if (typeof window === 'undefined') return null

  try {
    return window.localStorage
  } catch {
    return null
  }
}

function namespacedKey(key: string): string {
  return key.startsWith(STORAGE_PREFIX) ? key : `${STORAGE_PREFIX}${key}`
}

export const localStorageStore = {
  get<T>(key: string, fallback: T | null = null): T | null {
    const storage = getStorage()
    if (!storage) return fallback

    try {
      const raw = storage.getItem(namespacedKey(key))
      if (raw === null) return fallback

      const parsed = JSON.parse(raw) as StoredValue<T>
      if (parsed && typeof parsed === 'object' && 'value' in parsed) {
        if (parsed.expiresAt && parsed.expiresAt <= Date.now()) {
          storage.removeItem(namespacedKey(key))
          return fallback
        }
        return parsed.value
      }

      return parsed as T
    } catch {
      return fallback
    }
  },

  getString(key: string, fallback: string | null = null): string | null {
    const storage = getStorage()
    if (!storage) return fallback

    try {
      const storageKey = namespacedKey(key)
      const expiresAt = storage.getItem(`${storageKey}.expiresAt`)
      if (expiresAt && Number(expiresAt) <= Date.now()) {
        storage.removeItem(storageKey)
        storage.removeItem(`${storageKey}.expiresAt`)
        return fallback
      }
      return storage.getItem(storageKey) ?? fallback
    } catch {
      return fallback
    }
  },

  set<T>(key: string, value: T, expiresInMs?: number): boolean {
    const storage = getStorage()
    if (!storage) return false

    try {
      const payload: StoredValue<T> = {
        value,
        ...(expiresInMs ? { expiresAt: Date.now() + expiresInMs } : {}),
      }
      storage.setItem(namespacedKey(key), JSON.stringify(payload))
      return true
    } catch {
      return false
    }
  },

  setString(key: string, value: string, expiresInMs?: number): boolean {
    const storage = getStorage()
    if (!storage) return false

    try {
      storage.setItem(namespacedKey(key), value)
      if (expiresInMs) {
        storage.setItem(`${namespacedKey(key)}.expiresAt`, String(Date.now() + expiresInMs))
      }
      return true
    } catch {
      return false
    }
  },

  remove(key: string): void {
    const storage = getStorage()
    if (!storage) return

    try {
      storage.removeItem(namespacedKey(key))
      storage.removeItem(`${namespacedKey(key)}.expiresAt`)
    } catch {
      // Storage may be unavailable or restricted by the browser.
    }
  },

  has(key: string): boolean {
    return localStorageStore.getString(key) !== null
  },

  clear(): void {
    const storage = getStorage()
    if (!storage) return

    try {
      const keysToRemove: string[] = []
      for (let index = 0; index < storage.length; index += 1) {
        const key = storage.key(index)
        if (key?.startsWith(STORAGE_PREFIX)) keysToRemove.push(key)
      }
      keysToRemove.forEach((key) => storage.removeItem(key))
    } catch {
      // Storage may be unavailable or restricted by the browser.
    }
  },
}

export const localStore = localStorageStore
