export interface KeyRouterOptions {
  disabled?: boolean,
  nodePath?: NodePathItem[]
  transitionTimeout?: number
}

export interface NodePathItem {
  name: string
  params?: { [key: string]: any }
}

export interface Position {
  x: number
  y: number
}
