import { Tree } from '../tree'

class TreeTestEntity {
  p: boolean

  constructor (p: boolean) {
    this.p = p
  }

  isParentOf (p: TreeTestEntity): boolean {
    return this.p
  }

  stringify (): string {
    return ''
  }
}

describe('Tree', () => {
  describe('add', () => {
    const t = new Tree<TreeTestEntity>()
    it('the first element should be the root', () => {
      const b = t.add(new TreeTestEntity(false))
      expect(b).toEqual(true)
      expect(t._root).not.toBeNull()
      expect(t.unassigned.length).toEqual(0)
    })
    it('the second element should be the root', () => {
      const b = t.add(new TreeTestEntity(false))
      expect(b).toEqual(false)
      expect(t._root).not.toBeNull()
      expect(t.unassigned.length).toEqual(1)
    })
    it('the third element should be the new root', () => {
      const b = t.add(new TreeTestEntity(true))
      expect(b).toEqual(true)
      expect(t._root).not.toBeNull()
      expect(t.unassigned.length).toEqual(0)
    })
  })
})
