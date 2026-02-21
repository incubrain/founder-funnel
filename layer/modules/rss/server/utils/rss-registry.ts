import type { RSSHandler } from '../../runtime/types'

/** Runtime registry of RSS feed handlers, populated by the module at startup */
const handlers: Record<string, RSSHandler> = {}

export function registerRSSHandler(name: string, handler: RSSHandler): void {
  handlers[name] = handler
}

export function getRSSHandler(name: string): RSSHandler | null {
  return handlers[name] || null
}

export function getRegisteredFeeds(): string[] {
  return Object.keys(handlers)
}
