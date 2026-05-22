export const addPrerenderPath = (path: string) => {
  const event = useRequestEvent()
  // event.node is optional under h3@2; guard before touching the Node res.
  const res = event?.node?.res
  if (!res) return
  res.setHeader(
    'x-nitro-prerender',
    [res.getHeader('x-nitro-prerender'), path]
      .filter(Boolean)
      .join(','),
  )
}
