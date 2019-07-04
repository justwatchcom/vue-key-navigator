import PositionedRectangle from './PositionedRectangle'
import Point from './Point'

export function findClosestCorner (base: ClientRect, satellite: ClientRect): Point {
  const baseCenter = PositionedRectangle.createFromDomRectangle(base).getCenter()

  const satelliteRectangle = PositionedRectangle.createFromDomRectangle(satellite)

  return satelliteRectangle.findClosestCorner(baseCenter)
}
