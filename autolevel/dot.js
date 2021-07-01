/**
 *
 * @param {import("..").IVector2D} v
 * @returns
 */
export function dot(v) {
  return v.dx * v.dx + v.dy * v.dy;
}
