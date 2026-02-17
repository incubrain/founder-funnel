import withNuxt from './playground/.nuxt/eslint.config.mjs'
import pluginVueA11y from 'eslint-plugin-vuejs-accessibility'

export default withNuxt(
  {
    files: [
      'cli/**/*.ts',
    ],
  },
  ...pluginVueA11y.configs['flat/recommended'],
  {
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
)
