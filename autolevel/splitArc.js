import { pol } from "./pol";

/**
 *
 * @param {{center:import("../index").IPoint2D,radius:number}} circle
 * @param {import("../index").ILine} line
 * @returns
 */
export function inteceptCircleLineSeg(circle, line) {
  var a, b, c, d, u1, u2, ret, retP1, retP2, v1, v2;
  v1 = {};
  v2 = {};
  v1.x = line.p2.x - line.p1.x;
  v1.y = line.p2.y - line.p1.y;
  v2.x = line.p1.x - circle.center.x;
  v2.y = line.p1.y - circle.center.y;
  b = v1.x * v2.x + v1.y * v2.y;
  c = 2 * (v1.x * v1.x + v1.y * v1.y);
  b *= -2;
  d = Math.sqrt(
    b * b - 2 * c * (v2.x * v2.x + v2.y * v2.y - circle.radius * circle.radius)
  );
  if (isNaN(d)) {
    // no intercept
    return [];
  }
  if (c == 0) {
    return [];
  }
  u1 = (b - d) / c; // these represent the unit distance of point one and two on the line
  u2 = (b + d) / c;
  retP1 = {}; // return points
  retP2 = {};
  ret = []; // return array
  if (u1 <= 1 && u1 >= 0) {
    // add point if on the line segment
    retP1.x = line.p1.x + v1.x * u1;
    retP1.y = line.p1.y + v1.y * u1;
    ret[0] = retP1;
  }
  if (u2 <= 1 && u2 >= 0) {
    // second add point if on the line segment
    retP2.x = line.p1.x + v1.x * u2;
    retP2.y = line.p1.y + v1.y * u2;
    ret[ret.length] = retP2;
  }
  return ret;
}

/**
 *
 * @param {import("../index").IArc} arc
 * @param {import("../index").ILine} line
 */
export function inteceptArcLineSeg(arc, line, ccw) {
  var cw = !(ccw || false);

  var poStart = pol({
    dx: arc.start.x - arc.center.x,
    dy: arc.start.y - arc.center.y,
  });
  var poEnd = pol({
    dx: arc.end.x - arc.center.x,
    dy: arc.end.y - arc.center.y,
  });
  //   if (arc.start.x == arc.end.x && arc.start.y == arc.end.y) {
  if (cw) {
    if (poEnd.phi > poStart.phi) {
      poEnd.phi = poEnd.phi - 360;
    }
  } else {
    if (poEnd.phi < poStart.phi) {
      poEnd.phi = poEnd.phi + 360;
    }
  }
  //   }
  var inter = inteceptCircleLineSeg(
    { center: arc.center, radius: poStart.radius },
    line
  );
  if (inter.length) {
    var ft = inter.filter((it) => {
      // check point on arc
      var poInter = pol({ dx: it.x - arc.center.x, dy: it.y - arc.center.y });
      if (cw) {
        return poInter.phi <= poStart.phi && poInter.phi >= poEnd.phi;
      } else {
        return poInter.phi >= poStart.phi && poInter.phi <= poEnd.phi;
      }
    });
    if (ft.length) {
      if (ft.length > 1) {
        throw new Error("invalid alogitmic intersect");
      }
      return ft[0];
    }
  }
  return null;
}
