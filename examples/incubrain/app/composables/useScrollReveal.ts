export function useScrollReveal() {
  if (!import.meta.client) return

  onMounted(async () => {
    await nextTick()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' },
    )

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
  })
}
