import Point from '../Point'

describe('Point', () => {
  it('getGeneralDirectionTo', () => {
    const zero = new Point()
    const right = new Point({ x: 5 })
    const left = new Point({ x: -5 })
    const bottom = new Point({ y: 5 })
    const top = new Point({ y: -5 })
    expect(zero.getGeneralDirectionTo(right).getString()).toBe('right')
    expect(zero.getGeneralDirectionTo(left).getString()).toBe('left')
    expect(zero.getGeneralDirectionTo(bottom).getString()).toBe('bottom')
    expect(zero.getGeneralDirectionTo(top).getString()).toBe('top')
  })
  it('getDirectionTo', () => {
    const zero = new Point()
    const right = new Point({ x: 5 })
    const left = new Point({ x: -5 })
    const bottom = new Point({ y: 5 })
    const top = new Point({ y: -5 })
    expect(zero.getDirectionTo(right).degrees).toBe(0)
    expect(zero.getDirectionTo(left).degrees).toBe(180)
    expect(zero.getDirectionTo(bottom).degrees).toBe(90)
    expect(zero.getDirectionTo(top).degrees).toBe(-90)
  })
})
