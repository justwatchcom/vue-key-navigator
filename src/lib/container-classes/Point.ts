import FlatDirection from './FlatDirection'
import Direction from './Direction'

export default class Point {
  x: number = 0 // x points right
  y: number = 0 // y points down

  constructor (data: Partial<Point> = {}) {
    Object.assign(this, data)
  }

  /**
   * Get direction to point rounded to one of four directions:
   * left, right, top, bottom.
   */
  getGeneralDirectionTo (coordinate: Point): FlatDirection {
    const xProjection = coordinate.x - this.x
    const yProjection = coordinate.y - this.y
    const x = Math.abs(xProjection) > Math.abs(yProjection)
    const projection = x ? xProjection : yProjection
    return new FlatDirection({
      x,
      positive: (projection > 0),
    })
  }

  getDirectionTo (coordinate: Point): Direction {
    const deltaX = coordinate.x - this.x
    const deltaY = coordinate.y - this.y
    const degrees = Math.atan2(deltaY, deltaX) * 180 / Math.PI
    return new Direction(degrees)
  }

  getInDirection (direction: FlatDirection): Number {
    return direction.x ? this.x : this.y
  }

  toJson (): Object {
    return {
      x: this.x,
      y: this.y,
    }
  }
}
