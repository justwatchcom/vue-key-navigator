import { isCurrentRoute } from '../key-router-helpers'
import { NodePathItem } from '../interfaces'

describe('key-router-helpers', () => {
  describe('isCurrentRoute', () => {
    it('one item', () => {
      const routerKeyRoutes: NodePathItem[] = [{ name: 'titles' }]
      const componentKeyRoutes: NodePathItem[] = [{ name: 'titles' }]

      expect(isCurrentRoute(routerKeyRoutes, componentKeyRoutes)).toBe(true)
    })
    it('two items', () => {
      const routerKeyRoutes: NodePathItem[] = [{ name: 'titles' }, { name: 'title' }]
      const componentKeyRoutes: NodePathItem[] = [{ name: 'titles' }, { name: 'title' }]

      expect(isCurrentRoute(routerKeyRoutes, componentKeyRoutes)).toBe(true)
    })
    it('different length', () => {
      const routerKeyRoutes: NodePathItem[] = [{ name: 'titles' }, { name: 'title' }]
      const componentKeyRoutes: NodePathItem[] = [{ name: 'titles' }]

      expect(isCurrentRoute(routerKeyRoutes, componentKeyRoutes)).toBe(false)
    })
    it('params', () => {
      const routerKeyRoutes: NodePathItem[] = [{ name: 'titles' }, {
        name: 'title',
        params: { id: 1 },
      }]
      const componentKeyRoutes: NodePathItem[] = [{ name: 'titles' }, {
        name: 'title',
        params: { id: 1 },
      }]

      expect(isCurrentRoute(routerKeyRoutes, componentKeyRoutes)).toBe(true)
    })
    it('different params', () => {
      const routerKeyRoutes: NodePathItem[] = [{ name: 'titles' }, {
        name: 'title',
        params: { id: 1 },
      }]
      const componentKeyRoutes: NodePathItem[] = [{ name: 'titles' }, {
        name: 'title',
        params: { id: 3 },
      }]

      expect(isCurrentRoute(routerKeyRoutes, componentKeyRoutes)).toBe(false)
    })
  })
})
