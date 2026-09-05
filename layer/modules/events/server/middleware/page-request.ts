import { capturePageRequest } from '../utils/page-request'

/**
 * Every document GET → one `page_request` signal row.
 *
 * Registered as Nitro middleware so it sees requests that never reach a Vue
 * component — a crawler's plain GET, a no-JS browser, a curl. All the filtering
 * and the fire-and-forget append live in `utils/page-request.ts`; this file is
 * only the mount point.
 *
 * Returns nothing and awaits nothing: the middleware must not add latency to,
 * or be able to fail, the request it is observing.
 */
export default defineEventHandler((event) => {
  capturePageRequest(event)
})
