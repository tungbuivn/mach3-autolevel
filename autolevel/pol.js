/**
 *
 * @param {import("../index").IVector2D} v
 * @returns {import("../index").IPolar}
 */
export function pol(v) {
  var { dx, dy } = v;
  var r;
  if (dx == 0 && dy == 0) throw new Error("invalid vector");
  if (dx >= 0 && dy >= 0) {
    if (dx == 0) {
      r = Math.PI / 2;
    } else {
      r = Math.atan(dy / dx);
    }
  } else if (dx <= 0 && dy >= 0) {
    if (dy == 0) {
      r = Math.PI;
    } else {
      r = Math.atan(-dx / dy) + Math.PI / 2;
    }
  } else if (dx <= 0 && dy <= 0) {
    if (dx == 0) {
      r = (3 * Math.PI) / 2;
    } else {
      r = Math.atan(dy / dx) + Math.PI;
    }
  } else {
    r = Math.atan(-dx / dy) + (3 * Math.PI) / 2;
  }
  return { phi: (r * 180) / Math.PI, radius: Math.sqrt(dx * dx + dy * dy) };
}
