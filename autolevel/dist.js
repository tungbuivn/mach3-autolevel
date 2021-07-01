import { dot } from "./dot.js";

/**
 *
 * @param {import("../index").IPoint2D} a
 * @param {import("../index").IPoint2D} b
 * @returns
 */
export function dist(a, b) {
  var x = a.x - b.x,
    y = a.y - b.y;
  return Math.sqrt(dot({ dx: x, dy: y }));
}
