import type { ChangelogCollectionItem, TeamCollectionItem } from '@nuxt/content'

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
    () => appConfig.content?.defaultAuthor,
  )

  // Query all team members (only if showAuthor is enabled)
  const { data: teamMembers } = options.showAuthor
    ? useAsyncData('team-members', () =>
        queryCollection(collections.team).all() as Promise<TeamCollectionItem[]>,
      )
    : { data: ref([] as TeamCollectionItem[]) }

  // Map team members by slug for fast lookup
  const teamMemberMap = computed(() => {
    const map = new Map<string, TeamCollectionItem>()
    teamMembers.value?.forEach((member) => {
      map.set(member.slug, member)
    })
    return map
  })

  const getAuthorForItem = (item: Record<string, unknown>): AuthorData | null => {
    const authorSlug = (item.author as string) || defaultAuthorSlug.value
    if (!authorSlug) return null

    const member = teamMemberMap.value.get(authorSlug)
    if (!member) return null

    return {
      name: `${member.givenName} ${member.surname}`,
      avatar: member.avatar as unknown as string | undefined,
      to: member.links?.find(link => link.label === 'GitHub')?.url,
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

      const q = queryCollection(collections.changelog) as unknown as {
        select: (...fields: string[]) => unknown
        where: (field: string, op: string) => unknown
        order: (field: string, dir: string) => unknown
        all: () => Promise<ChangelogCollectionItem[]>
      }

      let query = q.select(...selectFields)

      if (options.labelField) {
        query = (query as typeof q).where(options.labelField, 'IS NOT NULL')
      }

      query = (query as typeof q).order(options.sortField, options.sortOrder)

      return (query as typeof q).all()
    },
  )

  return {
    items,
    pending,
    getAuthorForItem,
  }
}
