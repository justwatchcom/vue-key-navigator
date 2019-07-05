/**
 * Axis bound direction
 */
export default class FlatDirection {
  x: boolean = true // true if direction is x, false if y
  positive: boolean = true

  constructor (data: Partial<FlatDirection>) {
    Object.assign(this, data)
  }

  static createFromString (string: 'left' | 'right' | 'bottom' |'top'): FlatDirection {
    return new FlatDirection({
      x: ['left', 'right'].includes(string),
      positive: ['bottom', 'right'].includes(string),
    })
  }

  getString (): 'left' | 'right' | 'bottom' |'top' {
    if (this.x) {
      return this.positive ? 'right' : 'left'
    }
    return this.positive ? 'bottom' : 'top'
  }

  isRight (): boolean {
    return this.x && this.positive
  }

  isLeft (): boolean {
    return this.x && !this.positive
  }

  isBottom (): boolean {
    return !this.x && this.positive
  }

  isTop (): boolean {
    return !this.x && !this.positive
  }

  invert (): FlatDirection {
    return new FlatDirection({ ...this, positive: !this.positive })
  }
}
