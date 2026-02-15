export default defineNuxtConfig({
  extends: ['@incubrain/foundry'],

  // Provide test-specific configuration here instead of mocking
  runtimeConfig: {
    public: {
      configSource: 'test-app',
    },
  },

  // Disable some modules that might be too heavy or cause issues in minimal playground
  // (Optional, but can help isolate issues)
  // image: false,
  // seo: false,
})
