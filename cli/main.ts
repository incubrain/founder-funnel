#!/usr/bin/env node
import { createCLI } from './cli'

const cli = createCLI({
  name: 'create-foundry',
  description: 'Create a new IncuBrain Foundry project',
  setup: {
    defaults: {},
  },
})

cli.runMain()
