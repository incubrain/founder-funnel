import type { ChangelogCollectionItem } from '@nuxt/content'

interface ChangelogOptions {
  labelField: keyof ChangelogCollectionItem
  sortField: keyof ChangelogCollectionItem
  sortOrder: 'ASC' | 'DESC'
  showAuthor: boolean
  showImage: boolean
}

interface AuthorData {
  name: string
  avatar?: string
  to?: string
  target: string
}

/**
 * Handles changelog data fetching, team member lookups, and author resolution.
 *
 * Extracts all business logic from Changelog.vue so the component
 * only handles rendering.
 */
export function useChangelog(options: ChangelogOptions) {
  const { collections } = useContentConfig()
  const appConfig = useAppConfig()

  const defaultAuthorSlug = computed(
    () => appConfig.content?.defaultAuthor as string | undefined,
  )

  // Query all team members (only if showAuthor is enabled)
  const { data: teamMembers } = options.showAuthor
    ? useAsyncData('team-members', () =>
        queryCollection(collections.team).all(),
      )
    : { data: ref([]) }

  // Map team members by slug for fast lookup
  const teamMemberMap = computed(() => {
    const map = new Map<string, Record<string, unknown>>()
    teamMembers.value?.forEach((member: Record<string, unknown>) => {
      map.set(member.slug as string, member)
    })
    return map
  })

  const getAuthorForItem = (item: Record<string, unknown>): AuthorData | null => {
    const authorSlug = (item.author as string) || defaultAuthorSlug.value
    if (!authorSlug) return null

    const member = teamMemberMap.value.get(authorSlug)
    if (!member) return null

    const links = member.links as Array<{ label: string, url: string }> | undefined
    return {
      name: `${member.givenName} ${member.surname}`,
      avatar: member.avatar as string | undefined,
      to: links?.find(link => link.label === 'GitHub')?.url,
      target: '_blank',
    }
  }

  // Query changelog items
  const { data: items, pending } = useAsyncData(
    () => `changelog-${collections.changelog}`,
    () => {
      const selectFields: (keyof ChangelogCollectionItem)[] = [
        'path',
        options.labelField,
        options.sortField,
        'title',
        'description',
      ]

      if (options.showImage) {
        selectFields.push('image')
      }

      let query = queryCollection(collections.changelog as string)
        .select(...selectFields)

      if (options.labelField) {
        query = query.where(options.labelField, 'IS NOT NULL')
      }

      query = query.order(options.sortField, options.sortOrder)

      return query.all()
    },
  )

  return {
    items,
    pending,
    getAuthorForItem,
  }
}
