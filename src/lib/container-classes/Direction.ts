export default class Direction {
  degrees: number // (-180:180]

  constructor (degrees: number = 0) {
    degrees = degrees % 360
    if (degrees > 180) {
      degrees = degrees - 360
    }
    if (degrees <= -180) {
      degrees = degrees + 360
    }
    this.degrees = degrees
  }

  isRight (): boolean {
    return this.degrees > -90 && this.degrees < 90
  }

  isLeft (): boolean {
    return this.degrees < -90 || this.degrees > 90
  }

  isBottom (): boolean {
    return this.degrees > 0 && this.degrees < 180
  }

  isTop (): boolean {
    return this.degrees < 0 || this.degrees > 180
  }

  toArray (): string[] {
    const array = []
    this.isRight() && array.push('right')
    this.isLeft() && array.push('left')
    this.isTop() && array.push('top')
    this.isBottom() && array.push('bottom')
    return array
  }
}
