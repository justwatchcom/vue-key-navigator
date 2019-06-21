export interface Payload {
  isParentOf (p: Payload): boolean;

  stringify (): string;
}

export class Node<T extends Payload> {
  payload: T
  children: Node<T>[]

  constructor (p: T) {
    this.payload = p
    this.children = []
  }
}

/**
 * NodeTree implements a recursive datastructure with a single root node and multiple children nodes.
 */
export class NodeTree<T extends Payload> {
  _root: Node<T> | undefined
  unassigned: Node<T>[]

  constructor () {
    this.unassigned = []
  }

  get root (): Node<T> {
    if (!this._root) {
      throw 'tree not initialized'
    }
    this.clean()

    return this._root
  }

  set root (n: Node<T>) {
    this._root = n
  }

  clean (): { rootChanged: boolean; unassignedChanged: boolean } {
    let rootChanged: boolean = false
    const oldLen = this.unassigned.length
    this.unassigned = this.unassigned.filter(
      (n: Node<T>): boolean => {
        const res = this.addNode(n)
        rootChanged = res.rootChanged || rootChanged
        return !res.added
      },
    )
    return {
      rootChanged,
      unassignedChanged: this.unassigned.length !== oldLen,
    }
  }

  /**
   * add a new node to the tree
   * @param p the node to add
   * @returns whether the root node of the tree has changed
   */
  add (p: T): boolean {
    let n = new Node<T>(p)
    if (!this._root) {
      this._root = n
      return true
    }

    const { rootChanged, added } = this.addNode(n)
    if (!added) {
      this.unassigned.push(n)
    } else {
      this.unassigned = this.unassigned.filter((n: Node<T>): boolean => !this.addElement(n))
    }

    return rootChanged
  }

  private addNode (n: Node<T>): { rootChanged: boolean; added: boolean } {
    if (!this._root) {
      throw 'tree not initialized'
    }

    let rootChanged: boolean = false
    let added: boolean = false
    if (n.payload.isParentOf(this._root.payload)) {
      n.children.push(this._root)
      this._root = n
      added = true
      rootChanged = true
    } else {
      added = this.addElement(n)
    }
    return { rootChanged, added }
  }

  private addElement (n: Node<T>): boolean {
    if (!this._root) {
      throw 'tree not initialized'
    }

    let parent = this.findYoungestParent(this._root, n.payload)
    if (parent) {
      let newChildren: Node<T>[] = []
      parent.children.forEach(child => {
        if (n.payload.isParentOf(child.payload)) {
          n.children.push(child)
        } else {
          newChildren.push(child)
        }
      })
      parent.children = newChildren
      parent.children.push(n)
      return true
    }

    return false
  }

  private findYoungestParent (n: Node<T>, p: T): Node<T> | undefined {
    if (!n.payload.isParentOf(p)) {
      return undefined
    }

    for (let i = 0; i < n.children.length; i++) {
      let child = this.findYoungestParent(n.children[i], p)
      if (child) {
        return child
      }
    }

    return n
  }

  /**
   * removeElement removes the first element where cb returns false
   * @param cb callback which passes a node and expects a bool return value indicating whether to keep it.
   * @returns whether the the tree root has changed
   */
  removeElement (cb: (p: T) => boolean): boolean {
    if (!cb(this.root.payload)) {
      throw `cannot remove root`
    }

    this.filterBranch(cb, this.root)
    return false
  }

  private filterBranch (cb: (p: T) => boolean, n: Node<T>) {
    n.children = n.children.filter(
      (child: Node<T>): boolean => {
        if (cb(child.payload)) {
          this.filterBranch(cb, child)
          return true
        }

        return false
      },
    )
  }

  descendChildren (cb: (p: T[]) => number): T | undefined {
    if (cb([this.root.payload]) > -1) {
      return this.descendChildrenAll(this.root, cb)
    }
  }

  private descendChildrenAll (n: Node<T>, cb: (p: T[]) => number): T {
    let idx = cb(n.children.map((child: Node<T>): T => child.payload))
    if (idx > -1) {
      return this.descendChildrenAll(n.children[idx], cb)
    }

    return n.payload
  }

  search (cb: (p: T) => boolean): T[] {
    return this.findNode(cb).map((n: Node<T>): T => n.payload)
  }

  /**
   * All recursively traverses through a branch of nodes and subnodes.
   * An optional start node can be passed in order to just scan a subtree.
   * @param p the optional start node. If unset, root is used.
   * @param cb the callback which passes the node and returns whether to follow that branch.
   * @returns the last node (normally one without children) where the callback returned true.
   */
  all<P> (cb: (children: T[], index: number, hasChildren: boolean, param: P) => P, startParam: P): void {
    this.iterateAll<P>([this.root], cb, startParam)
  }

  private iterateAll<P> (
    children: Node<T>[],
    cb: (children: T[], index: number, hasChildren: boolean, param: P) => P,
    param: P,
  ): void {
    const payloads = children.map((child: Node<T>): T => child.payload)

    children.forEach((child: Node<T>, index: number) => {
      this.iterateAll<P>(child.children, cb, cb(payloads, index, child.children.length > 0, param))
    })
  }

  /**
   * getSiblings returns all children of the passed node except the passed node itself
   * @param p the node of which the siblings shall be returned
   * @returns the silblings of the parameter node
   */
  getSiblings (p: T): T[] {
    const nodes = this.findNode((n: T): boolean => n === p)
    if (nodes.length < 2) {
      return []
    }

    return nodes[1].children
      .filter((child: Node<T>): boolean => child !== nodes[0])
      .map((child: Node<T>): T => child.payload)
  }

  /**
   * getChildren returns the children of a node
   * @param p the node of which the children shall be returned
   * @returns the children
   */
  getChildren (p: T): T[] {
    const nodes = this.findNode((n: T): boolean => n === p)
    if (nodes.length === 0) {
      return []
    }

    return nodes[0].children.map((child: Node<T>): T => child.payload)
  }

  /**
   * ascendParents starts at a node and then calls cb with its parent until it returns true.
   * @param p the node to start with
   * @param cb the callback telling whether to stop ascending
   */
  ascendParents (p: T, cb: (p: T) => boolean): T | undefined {
    const res = this.findNode((n: T): boolean => n === p).find((node: Node<T>): boolean => cb(node.payload))
    if (!res) {
      return undefined
    }

    return res.payload
  }

  /**
   * getParent returns the
   * @param p the node of which the parent shall be returned
   * @returns the parent node
   */
  getParent (p: T): T | undefined {
    const nodes = this.findNode((n: T): boolean => n === p)
    if (nodes.length < 2) {
      return undefined
    }

    return nodes[1].payload
  }

  /**
   * findNode searches for the node of a payload and returns an array containing it and all its ancestors.
   * @param searchedPayload the child nodes we want the ancestors for
   * @param start the start node to search for. If undefined, root will be the start.
   * @returns [searchedNode, parent, grandparent, ...]
   */
  private findNode (cb: (t: T) => boolean, start?: Node<T>): Node<T>[] {
    if (!start) {
      start = this.root
    }

    if (cb(start.payload)) {
      return [start]
    }

    for (let i = 0; i < start.children.length; i++) {
      const children = this.findNode(cb, start.children[i])
      if (children.length > 0) {
        children.push(start)
        return children
      }
    }

    return []
  }

  ascii (): string {
    if (!this.root) {
      return ''
    }

    return `${this.unassigned.length} unassigned\n\n${this.toAscii(this.root, [])}`
  }

  private toAscii (n: Node<T>, isLast: boolean[]): string {
    return (
      '\n' +
      isLast
        .map(
          (b: boolean, index: number, arr: boolean[]): string =>
            index === arr.length - 1 ? (b ? '└' : '├') + '── ' : (b ? ' ' : '|') + '   ',
        )
        .join('') +
      n.payload.stringify() +
      n.children
        .map(
          (child: Node<T>, index: number, arr: Node<T>[]): string =>
            this.toAscii(child, [...isLast, index === arr.length - 1]),
        )
        .join('')
    )
  }
}
