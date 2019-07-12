import { NodePathItem } from './interfaces'

export function isCurrentRoute (keyPath: NodePathItem[], componentKeyPath: NodePathItem[]): boolean {
  if (keyPath.length !== componentKeyPath.length) {
    return false
  }

  for (let i = 0; i < keyPath.length; i++) {
    const keyPathItem = keyPath[i]
    const componentKeyPathItem = componentKeyPath[i]
    if (keyPathItem.name !== componentKeyPathItem.name) {
      return false
    }
    if (keyPathItem.params || componentKeyPathItem.params) {
      return isEqualShallow(keyPathItem.params, componentKeyPathItem.params)
    }
  }

  return true
}

export function isSameRoot (nodePathA: NodePathItem[], nodePathB: NodePathItem[]): boolean {
  const nodePathItemA = nodePathA[0]
  const nodePathItemB = nodePathB[0]

  if (nodePathItemA.name !== nodePathItemB.name) {
    return false
  }

  if (nodePathItemA.params || nodePathItemB.params) {
    return isEqualShallow(nodePathItemA.params, nodePathItemB.params)
  }

  return true
}

export function isEqualShallow (a: { [key: string]: any } | undefined, b: { [key: string]: any } | undefined): boolean {
  // Handle undefined values.
  if (!a || !b) {
    return !a && !b
  }

  // TODO Could be optimized a bit, as we don't have to traverse all keys twice.
  for (const key in a) {
    if (a[key] !== b[key]) {
      return false
    }
  }
  for (const key in b) {
    if (a[key] !== b[key]) {
      return false
    }
  }
  return true
}
