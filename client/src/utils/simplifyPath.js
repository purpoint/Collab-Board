const perpendicularDistance = (point, start, end) => {
  const dx = end.x - start.x
  const dy = end.y - start.y

  if (dx === 0 && dy === 0) {
    return Math.hypot(point.x - start.x, point.y - start.y)
  }

  const t = ((point.x - start.x) * dx + (point.y - start.y) * dy) / (dx * dx + dy * dy)
  const closestX = start.x + t * dx
  const closestY = start.y + t * dy

  return Math.hypot(point.x - closestX, point.y - closestY)
}

const rdp = (points, tolerance) => {
  if (points.length <= 2) return points

  const first = points[0]
  const last  = points[points.length - 1]

  let maxDistance = 0
  let maxIndex    = 0

  for (let i = 1; i < points.length - 1; i++) {
    const dist = perpendicularDistance(points[i], first, last)
    if (dist > maxDistance) {
      maxDistance = dist
      maxIndex    = i
    }
  }

  if (maxDistance <= tolerance) {
    return [first, last]
  }

  const left  = rdp(points.slice(0, maxIndex + 1), tolerance)
  const right = rdp(points.slice(maxIndex), tolerance)

  return [...left.slice(0, -1), ...right]
}

export const simplifyPath = (points, tolerance = 2) => {
  if (!points || points.length < 3) return points
  return rdp(points, tolerance)
}