import Point from './Point'

export default class PositionedRectangle {
  coordinate: Point = new Point()
  width: number = 0
  height: number = 0

  get left () {
    return this.coordinate.x
  }

  set left (left) {
    this.coordinate = new Point({ ...this.coordinate, x: left })
  }

  get top () {
    return this.coordinate.y
  }

  set top (top) {
    this.coordinate = new Point({ ...this.coordinate, y: top })
  }

  get right () {
    return this.coordinate.x + this.width
  }

  set right (right) {
    this.coordinate = new Point({
      x: right - this.width,
      y: this.coordinate.y
    })
  }

  get bottom () {
    return this.coordinate.y + this.height
  }

  set bottom (bottom) {
    this.coordinate = new Point({
      x: this.coordinate.x,
      y: bottom - this.height
    })
  }

  constructor (data: Partial<PositionedRectangle>) {
    Object.assign(this, data)
  }

  static createFromDomRectangle (rectangle: {left: number, top: number, width: number, height: number}): PositionedRectangle {
    return new PositionedRectangle({
      coordinate: new Point({
        x: rectangle.left || 0,
        y: rectangle.top || 0,
      }),
      width: rectangle.width,
      height: rectangle.height,
    })
  }

  static createFromHtmlElement(element: HTMLElement){
    return PositionedRectangle.createFromDomRectangle(
      element.getBoundingClientRect()
    )
  }

  fitsInto (rectangle: PositionedRectangle): boolean {
    return Math.abs(this.width) < Math.abs(rectangle.width) &&
      Math.abs(this.height) < Math.abs(rectangle.height)
  }

  overlaps (rectangle: PositionedRectangle): boolean {
    return !(
      this.left >= rectangle.right ||
      rectangle.left >= this.right ||
      this.top >= rectangle.bottom ||
      rectangle.top >= this.bottom
    )
  }

  includes (coordinate: Point): boolean {
    return this.left <= coordinate.x &&
      this.right >= coordinate.x &&
      this.top <= coordinate.y &&
      this.bottom >= coordinate.y
  }

  toJson () {
    return {
      left: this.left,
      right: this.right,
      top: this.top,
      bottom: this.bottom,
      width: this.width,
      height: this.height,
    }
  }

  moveAwayFrom (coordinate: Point): PositionedRectangle {
    if (!this.includes(coordinate)) {
      return new PositionedRectangle(this)
    }

    const direction = coordinate.getGeneralDirectionTo(this.getCenter())
    const result = new PositionedRectangle(this)

    result[direction.invert().getString()] = coordinate.getInDirection(direction)
    return result
  }

  isInside (container: PositionedRectangle): boolean {
    return (
      container.left <= this.left &&
      container.right >= this.right &&
      container.top <= this.top &&
      container.bottom >= this.bottom
    )
  }

  getCenter (): Point {
    const x = this.coordinate.x + this.width / 2
    const y = this.coordinate.y + this.height / 2
    return new Point({ x, y })
  }

  findClosestCorner (coordinate: Point): Point {
    const center = this.getCenter()
    return new Point({
      x: center.x > coordinate.x ? this.left : this.right,
      y: center.y > coordinate.y ? this.bottom : this.top,
    })
  }
}
