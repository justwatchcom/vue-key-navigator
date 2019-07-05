import PositionedRectangle from '../PositionedRectangle'
import ScreenCoordinate from '../Point'

describe('PositionedRectangle', () => {
  it('can initialize', () => {
    new PositionedRectangle({ width: 10, height: 10 })
  })
  it('fitsInto', () => {
    const small = new PositionedRectangle({ width: 10, height: 10 })
    const big = new PositionedRectangle({ width: 20, height: 20 })

    expect(small.fitsInto(big)).toBe(true)
    expect(big.fitsInto(small)).toBe(false)
  })
  it('createFromDomRectangle', () => {
    const result = PositionedRectangle.createFromDomRectangle({
      left: 1,
      top: 2,
      width: 3,
      height: 4,
    })
    expect(result.coordinate.x).toBe(1)
    expect(result.coordinate.y).toBe(2)
    expect(result.width).toBe(3)
    expect(result.height).toBe(4)
  })
  it('getCenterCoordinate', () => {
    const rectangle = PositionedRectangle.createFromDomRectangle({
      left: 10,
      top: 10,
      width: 10,
      height: 10,
    })
    const center = rectangle.getCenter()
    expect(center.x).toBe(15)
    expect(center.y).toBe(15)
  })
  it('overlaps', () => {
    const main = PositionedRectangle.createFromDomRectangle({
      left: 0,
      top: 0,
      width: 10,
      height: 10
    })
    const inbound = PositionedRectangle.createFromDomRectangle({
      top: 0,
      left: 5,
      width: 10,
      height: 10
    })
    const outbound = PositionedRectangle.createFromDomRectangle({
      top: 0,
      left: 10,
      width: 5,
      height: 5
    })
    expect(main.overlaps(inbound)).toBe(true)
    expect(main.overlaps(outbound)).toBe(false)
  })

  it('moveAwayFrom', () => {
    // active encroaches on stable. We want to separate active
    const active = PositionedRectangle.createFromDomRectangle({
      left: 0,
      top: 0,
      width: 10,
      height: 10
    })
    expect(active.left).toBe(0)
    const coordinate = new ScreenCoordinate({ x: 1, y: 3 })
    const result = active.moveAwayFrom(coordinate)
    expect(result.left).toBe(1)
  })

  it('isInside', () => {
    // active encroaches on stable. We want to separate active
    const container = PositionedRectangle.createFromDomRectangle({
      left: 0,
      top: 0,
      width: 5,
      height: 5
    })
    const inside = PositionedRectangle.createFromDomRectangle({
      left: 0,
      top: 0,
      width: 4,
      height: 4
    })
    const outside = PositionedRectangle.createFromDomRectangle({
      left: 0,
      top: 0,
      width: 6,
      height: 6
    })
    expect(inside.isInside(container)).toBe(true)
    expect(outside.isInside(container)).toBe(false)
  })
})
