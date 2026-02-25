export interface CLIOptions {
  name: string
  description: string
  setup: {
    defaults: Record<string, never>
  }
}

export interface CopyListFile {
  src: string
  dest?: string
}

export interface CopyListConfig {
  repo?: string
  ref?: string
  files: CopyListFile[]
}
