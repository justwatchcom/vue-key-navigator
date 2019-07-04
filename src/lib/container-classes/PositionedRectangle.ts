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

  static createFromDomRectangle (domRectangle: ClientRect): PositionedRectangle {
    return new PositionedRectangle({
      coordinate: new Point({
        x: domRectangle.left || 0,
        y: domRectangle.top || 0,
      }),
      width: domRectangle.width,
      height: domRectangle.height,
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
    result[direction.invert()
      .toString()] = coordinate.getInDirection(direction)
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

  fitInto (container: PositionedRectangle): PositionedRectangle {
    // Already inside, no need to move
    if (this.isInside(container)) {
      return new PositionedRectangle(this)
    }
    // Won't fit.
    if (!this.fitsInto(container)) {
      return new PositionedRectangle(this)
    }

    let result = this.moveInsideContainerAxisDirected(container)
    if (!result.isInside(container)) {
      result = result.moveInsideContainerAxisDirected(container)
    }

    return result
  }

  fitAround(target: PositionedRectangle): void {
    this.coordinate = target.coordinate

    if(this.canFitToBottom(target)){
      this.fitToBottom(target)
      return
    }
    if(this.canFitToTop(target)){
      this.fitToTop(target)
      return
    }

    this.fitToBottom(target)
  }

  fitToBottom(target: PositionedRectangle): PositionedRectangle{
    this.top = target.bottom
    this.width = target.width
  }
  fitToTop(target: PositionedRectangle): PositionedRectangle{
    this.bottom = target.top
    this.width = target.width
  }
  canFitToBottom(target: PositionedRectangle): Bolean{
    const container = PositionedRectangle.createForWindow()
    return target.bottom + this.height <= container.bottom
  }
  canFitToTop(target: PositionedRectangle): Bolean{
    const container = PositionedRectangle.createForWindow()
    return target.top - this.height >= container.top
  }

  static createForWindow(padding: number = 1): PositionedRectangle {
    // TODO Probably makes sense to handle this outside of window to keep lib clean.
    return  PositionedRectangle.createFromDomRectangle({
      left: padding,
      top: padding,
      right: padding,
      bottom: padding,
      width: window.innerWidth - padding * 2,
      height: window.innerHeight - padding * 2,
    })
  }

  findClosestCorner (coordinate: Point): Point {
    const center = this.getCenter()
    return new Point({
      x: center.x > coordinate.x ? this.left : this.right,
      y: center.y > coordinate.y ? this.bottom : this.top,
    })
  }

  findFurthestCorner (coordinate: Point): Point {
    const center = this.getCenter()
    return new Point({
      x: center.x < coordinate.x ? this.left : this.right,
      y: center.y < coordinate.y ? this.bottom : this.top,
    })
  }
}
