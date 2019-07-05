import { isStraightInDirection } from '../container-helpers'
import { Direction } from '../../KeyRouter'

describe('container-helpers', () => {
  fit('initialized with degree', () => {
    function generateRectangle(left: number, top: number, size = 50): ClientRect {
      return {
        left,
        right: left + size,
        top,
        bottom: top + size,

        height: size,
        width: size,
      }
    }

    const base = generateRectangle(0, 0)

    expect(isStraightInDirection(base, generateRectangle(50, 0), Direction.Right)).toBe(true)
    expect(isStraightInDirection(base, generateRectangle(0, 50), Direction.Right)).toBe(false)
    expect(isStraightInDirection(base, generateRectangle(50, 0), Direction.Down)).toBe(false)
    expect(isStraightInDirection(base, generateRectangle(0, 50), Direction.Down)).toBe(true)
    // Right and left are treated the same.
    expect(isStraightInDirection(base, generateRectangle(50, 0), Direction.Left)).toBe(true)
    // Up and down are treated the same.
    expect(isStraightInDirection(base, generateRectangle(0, 50), Direction.Up)).toBe(true)
    // Partial collision
    expect(isStraightInDirection(base, generateRectangle(0, 20), Direction.Right)).toBe(true)
    expect(isStraightInDirection(base, generateRectangle(0, 30), Direction.Right)).toBe(false)
  })
})
