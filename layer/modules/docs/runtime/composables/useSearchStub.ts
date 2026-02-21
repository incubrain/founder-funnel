import { ref } from 'vue'

/**
 * No-op search stub used when the docs module is disabled.
 * Returns null searchFiles so UContentSearch won't render.
 */
export const useSearch = async () => {
  return {
    searchFiles: ref(null),
  }
}
