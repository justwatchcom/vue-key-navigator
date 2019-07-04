import Direction from '../Direction'

describe('Direction', () => {
  it('initialized with degree', () => {
    expect(new Direction(300).degrees).toBe(-60)
  })
  it('isRight', () => {
    expect(new Direction(0).isRight()).toBe(true)
    expect(new Direction(-89).isRight()).toBe(true)
    expect(new Direction(89).isRight()).toBe(true)
    expect(new Direction(90).isRight()).toBe(false)
    expect(new Direction(-120).isRight()).toBe(false)
  })
  it('isLeft', () => {
    expect(new Direction(180).isLeft()).toBe(true)
    expect(new Direction(-180).isLeft()).toBe(true)
    expect(new Direction(-91).isLeft()).toBe(true)
    expect(new Direction(91).isLeft()).toBe(true)
    expect(new Direction(90).isLeft()).toBe(false)
    expect(new Direction(60).isLeft()).toBe(false)
  })
  it('isTop', () => {
    expect(new Direction(-90).isTop()).toBe(true)
    expect(new Direction(-1).isTop()).toBe(true)
    expect(new Direction(-179).isTop()).toBe(true)
    expect(new Direction(90).isTop()).toBe(false)
    expect(new Direction(120).isTop()).toBe(false)
  })
  it('isBottom', () => {
    expect(new Direction(90).isBottom()).toBe(true)
    expect(new Direction(179).isBottom()).toBe(true)
    expect(new Direction(1).isBottom()).toBe(true)
    expect(new Direction(0).isBottom()).toBe(false)
    expect(new Direction(-15).isBottom()).toBe(false)
  })
})
