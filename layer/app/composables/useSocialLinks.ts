interface SocialLink {
  'icon': string
  'to': string
  'target': string
  'aria-label': string
}

/**
 * Maps a socials config object (e.g. { github: 'https://...', email: 'mailto:...' })
 * into an array of link objects with platform-appropriate icons.
 *
 * Used by AppHeaderRight and AppFooterRight to avoid duplicating the icon mapping.
 */
export function useSocialLinks(socials: Ref<Record<string, string>> | ComputedRef<Record<string, string>>) {
  return computed<SocialLink[]>(() =>
    Object.entries(unref(socials) ?? {}).map(([key, url]) => ({
      'icon': key === 'email' ? 'i-lucide-mail' : `i-simple-icons-${key}`,
      'to': url,
      'target': '_blank',
      'aria-label': `${key} social link`,
    })),
  )
}
