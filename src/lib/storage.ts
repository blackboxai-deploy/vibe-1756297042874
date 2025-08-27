import { Workspace } from './types'

const STORAGE_KEY = 'notionclone-workspace'

export function saveToStorage(workspace: Workspace): void {
  try {
    const serialized = JSON.stringify(workspace, (_, value) => {
      // Convert Date objects to ISO strings
      if (value instanceof Date) {
        return value.toISOString()
      }
      return value
    })
    localStorage.setItem(STORAGE_KEY, serialized)
  } catch (error) {
    console.error('Failed to save workspace to localStorage:', error)
  }
}

export function loadFromStorage(): Workspace | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null

    const parsed = JSON.parse(stored, (_, value) => {
      // Convert ISO strings back to Date objects
      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
        return new Date(value)
      }
      return value
    })

    return parsed as Workspace
  } catch (error) {
    console.error('Failed to load workspace from localStorage:', error)
    return null
  }
}

export function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear workspace from localStorage:', error)
  }
}