export interface MeikoConfig {
  root: string
  baseUrl?: string
  outDir?: string
  mode?: 'development' | 'production'
  pages: PageField[]
  alais: Record<string, string>
  webpack: {}
}

export interface PageField {
  path: string
}
