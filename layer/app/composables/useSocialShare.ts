interface SocialShareOptions {
  title: string
  description: string
  url?: string
}

/**
 * Handles social sharing URLs, clipboard copy with feedback state,
 * and platform-specific link generation.
 *
 * Extracts business logic from SocialShare.vue.
 */
export function useSocialShare(options: Ref<SocialShareOptions> | ComputedRef<SocialShareOptions>) {
  const copied = ref(false)

  const shareUrl = computed(() => {
    const opts = unref(options)
    if (opts.url) return opts.url
    if (import.meta.client) return window.location.href
    return ''
  })

  const encodeText = (text: string) => encodeURIComponent(text)

  const buildShareLink = (platform: string): string | null => {
    const url = shareUrl.value
    const opts = unref(options)
    const title = encodeText(opts.title || '')
    const description = encodeText(opts.description || '')

    switch (platform) {
      case 'twitter':
        return `https://twitter.com/intent/tweet?text=${title}&url=${encodeText(url)}`
      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeText(url)}`
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeText(url)}`
      case 'email':
        return `mailto:?subject=${title}&body=${description}%0A%0A${encodeText(url)}`
      default:
        return null
    }
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl.value)
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 2000)
    }
    catch {
      // Clipboard API may not be available in some contexts
    }
  }

  const share = (platform: string) => {
    if (platform === 'copy') {
      copyLink()
      return
    }

    const link = buildShareLink(platform)
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer,width=600,height=600')
    }
  }

  const menuItems = computed(() => [
    { label: 'Share on Twitter/X', icon: 'i-lucide-twitter', value: 'twitter' },
    { label: 'Share on LinkedIn', icon: 'i-lucide-linkedin', value: 'linkedin' },
    { label: 'Share on Facebook', icon: 'i-lucide-facebook', value: 'facebook' },
    { label: 'Share via Email', icon: 'i-lucide-mail', value: 'email' },
    { type: 'separator' as const },
    {
      label: copied.value ? 'Copied!' : 'Copy Link',
      icon: copied.value ? 'i-lucide-check' : 'i-lucide-link',
      value: 'copy',
      chip: copied.value ? { color: 'success' as const } : undefined,
    },
  ])

  return {
    copied,
    shareUrl,
    menuItems,
    share,
    copyLink,
  }
}
