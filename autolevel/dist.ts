import { IPoint2D } from "../index.js";
import { dot } from "./dot.js";

/**
 *
 * @param {import("../index").IPoint2D} a
 * @param {import("../index").IPoint2D} b
 * @returns
 */
export function dist(a:IPoint2D, b:IPoint2D) {
  var x = a.x - b.x,
    y = a.y - b.y;
  return Math.sqrt(dot({ dx: x, dy: y }));
}
