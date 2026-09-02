const STORAGE_PREFIX = 'kazilink.'

function getStorage(): Storage | null {
  if (typeof window === 'undefined') return null

  try {
    return window.sessionStorage
  } catch {
    return null
  }
}

function namespacedKey(key: string): string {
  return key.startsWith(STORAGE_PREFIX) ? key : `${STORAGE_PREFIX}${key}`
}

export const sessionStorageStore = {
  get<T>(key: string, fallback: T | null = null): T | null {
    const storage = getStorage()
    if (!storage) return fallback

    try {
      const raw = storage.getItem(namespacedKey(key))
      if (raw === null) return fallback
      return JSON.parse(raw) as T
    } catch {
      return fallback
    }
  },

  getString(key: string, fallback: string | null = null): string | null {
    const storage = getStorage()
    if (!storage) return fallback

    try {
      return storage.getItem(namespacedKey(key)) ?? fallback
    } catch {
      return fallback
    }
  },

  set<T>(key: string, value: T): boolean {
    const storage = getStorage()
    if (!storage) return false

    try {
      storage.setItem(namespacedKey(key), JSON.stringify(value))
      return true
    } catch {
      return false
    }
  },

  setString(key: string, value: string): boolean {
    const storage = getStorage()
    if (!storage) return false

    try {
      storage.setItem(namespacedKey(key), value)
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
    } catch {
      // Storage may be unavailable or restricted by the browser.
    }
  },

  has(key: string): boolean {
    return sessionStorageStore.getString(key) !== null
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

export const sessionStore = sessionStorageStore
