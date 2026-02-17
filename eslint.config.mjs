import { createConfigForNuxt } from '@nuxt/eslint-config/flat'
import pluginVueA11y from 'eslint-plugin-vuejs-accessibility'

export default createConfigForNuxt({
  dirs: {
    src: [
      './layer',
      './examples',
    ],
  },
  features: {
    tooling: true,
    stylistic: true,
  },
}, {
  files: [
    'cli/**/*.ts',
  ],
}).append(
  ...pluginVueA11y.configs['flat/recommended'],
  {
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
)
