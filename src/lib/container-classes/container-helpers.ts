import { Direction } from '../KeyRouter'

export function getCenter(clientRect: ClientRect) {
  return {
    x: clientRect.left + clientRect.width / 2,
    y: clientRect.top + clientRect.height / 2,
  }
}


export function isStraightInDirection (base: ClientRect, satellite: ClientRect, direction: Direction): boolean {
  const baseCenter = getCenter(base)

  const isHorizontal = [Direction.Left, Direction.Right].includes(direction)

  if (isHorizontal) {
    return satellite.top < baseCenter.y && baseCenter.y < satellite.bottom
  }
  return satellite.left < baseCenter.x && baseCenter.x < satellite.right
}

export function isInDirection (base: ClientRect, satellite: ClientRect, direction: Direction): boolean {
  const baseCenter = getCenter(base)
  const satelliteCenter = getCenter(satellite)

  if (direction === Direction.Left) {
    return satelliteCenter.x < baseCenter.x
  }
  if (direction === Direction.Right) {
    return satelliteCenter.x > baseCenter.x
  }

  if (direction === Direction.Up) {
    return satelliteCenter.y < baseCenter.y
  }
  if (direction === Direction.Down) {
    return satelliteCenter.y > baseCenter.y
  }
  return false
}

export function getDistance (base: ClientRect, satellite: ClientRect) {
  const baseCenter = getCenter(base)
  const satelliteCenter = getCenter(satellite)

  return Math.sqrt( Math.pow(baseCenter.x - satelliteCenter.x, 2) + Math.pow(baseCenter.y - satelliteCenter.y, 2) )
}
