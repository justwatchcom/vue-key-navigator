import Bezier from 'bezier-js'

export class Point {
  x: number
  y: number

  constructor (x: number, y: number) {
    this.x = Math.round(x)
    this.y = Math.round(y)
  }

  sub (p: Point): Point {
    return new Point(this.x - p.x, this.y - p.y)
  }

  multiply (x: number): Point {
    return new Point(this.x * x, this.y * x)
  }
}

export default class Scroller {
  private static SCROLLING_DURATION: number = 200
  private static SCROLLING_INTERVAL: number = 50
  private static SMOOTH_SCROLLING_SUPPORTED: boolean = ('scrollBehavior' in document!.documentElement.style)
  private static BEZIER: Bezier = new Bezier(0, 0, 0, 0.42, 0.58, 1, 1, 1)

  private readonly container: Element
  private interval: NodeJS.Timeout | undefined

  private readonly scrollLeft: boolean
  private readonly scrollTop: boolean
  private startTime: number = 0
  private totalScrollDiff: Point = new Point(0, 0)
  private lastScrollDiff: Point = new Point(0, 0)
  private margin: Point

  constructor (container: any, scrollLeft: boolean, scrollTop: boolean, margin: Point) {
    this.container = Scroller.convertToElement(container)
    this.margin = margin
    this.scrollLeft = scrollLeft
    this.scrollTop = scrollTop
  }

  private static convertToElement (el: any): Element {
    if (!(el instanceof Element)) {
      throw new Error(`element is not a valid Element, got type ${typeof el}`)
    }

    return el
  }

  scroll (selection: Element): void {
    this.totalScrollDiff = this.getDiff(selection)
    this.lastScrollDiff = new Point(0, 0)
    this.startTime = new Date().getTime()

    if (Scroller.SMOOTH_SCROLLING_SUPPORTED) {
      this.scrollStep(1)
      return
    }

    if (this.interval) {
      clearInterval(this.interval)
    }
    this.interval = setInterval(() => this.scrollInterval(), Scroller.SCROLLING_INTERVAL)
  }

  private scrollInterval (): void {
    let p = this.percent
    if (p >= 1) {
      p = 1
      this.destroy()
    }

    this.scrollStep(p)
  }

  private scrollStep (p: number) {
    const currentScrollPosition = this.getCurrentScrollPosition(p)
    const currentDiff = currentScrollPosition.sub(this.lastScrollDiff)

    this.container.scrollLeft += currentDiff.x
    this.container.scrollTop += currentDiff.y

    this.lastScrollDiff = currentScrollPosition
  }

  get percent (): number {
    return (new Date().getTime() - this.startTime) / Scroller.SCROLLING_DURATION
  }

  getCurrentScrollPosition (p: number): Point {
    const factor = Scroller.BEZIER.compute(p).y
    return this.totalScrollDiff.multiply(factor)
  }

  getDiff (selection: Element): Point {
    const containerRect = this.container.getBoundingClientRect()
    const selectionRect = selection.getBoundingClientRect()

    let x = 0
    let y = 0

    if (this.scrollLeft) {
      x = selectionRect.left - containerRect.left - Scroller.getPadding(this.container, 'left') - this.margin.x
    }
    if (this.scrollTop) {
      y = selectionRect.top - containerRect.top - Scroller.getPadding(this.container, 'top') - this.margin.y
    }

    return new Point(x, y)
  }

  private static getPadding (element: Element, side: string): number {
    const padding = window
      .getComputedStyle(element, null)
      .getPropertyValue(`padding-${side}`)
      .match(/\d+/)

    if (!padding) {
      return 0
    }

    return parseFloat(padding[0])
  }

  destroy (): void {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = undefined
    }
  }
}
