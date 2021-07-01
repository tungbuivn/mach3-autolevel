import { dist } from "./dist.js";
import { pol } from "./pol.js";

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
    if (typeof retP1.x != "undefined") {
      if (dist(retP1, retP2) >= 1e-6) {
        ret[ret.length] = retP2;
      }
    } else {
      ret[ret.length] = retP2;
    }
  }
  return ret;
}

/**
 *
 * @param {import("../index").IArc} arc
 * @param {import("../index").ILine} line
 * @returns {import("../index").IPoint2D | null} return intersect point or null
 */
export function inteceptArcLineSeg(arc, line, ccw) {
  ccw = !!(ccw || false);
  var cw = !(ccw || false);

  var poStart = pol({
    dx: arc.start.x - arc.center.x,
    dy: arc.start.y - arc.center.y,
  });
  // var poEnd = pol({
  //   dx: arc.end.x - arc.center.x,
  //   dy: arc.end.y - arc.center.y,
  // });
  //   if (arc.start.x == arc.end.x && arc.start.y == arc.end.y) {
  // if (cw) {
  //   if (poEnd.phi > poStart.phi) {
  //     poEnd.phi = poEnd.phi - 360;
  //   }
  // } else {
  //   if (poEnd.phi < poStart.phi) {
  //     poEnd.phi = poEnd.phi - 360;
  //   }
  // }
  //   }
  var inter = inteceptCircleLineSeg(
    { center: arc.center, radius: poStart.radius },
    line
  );
  if (inter.length) {
    var ft = inter.filter((it) => {
      // check point on arc
      var dx = it.x - arc.center.x,
        dy = it.y - arc.center.y,
        vax = arc.start.x - arc.center.x,
        vay = arc.start.y - arc.center.y,
        vbx = arc.end.x - arc.center.x,
        vby = arc.end.y - arc.center.y;
      // var poInter = pol({ dx: dx, dy: dy });
      //if (s.x * d.y - s.y * d.x >= 0)  && (e.x * d.y - e.y * d.x <= 0)
      // P  is inside the circle: d(O,P)≤r
      // P is to the left of OA: OA×OP≥0
      // P is to the right of OB: OB×OP≤0
      if (
        (vax * dy - vay * dx <= 0 && //right to start
          vbx * dy - vby * dx >= 0 && // left to end
          cw) ||
        (vax * dy - vay * dx >= 0 && //left to start
          vbx * dy - vby * dx <= 0 && // right to end
          ccw)
      ) {
        return true;
      }
      return false;
      // if (cw) {
      //   return poInter.phi <= poStart.phi && poInter.phi >= poEnd.phi;
      // } else {
      //   return (
      //     (poInter.phi >= poStart.phi && poInter.phi <= poEnd.phi) ||
      //     (poInter.phi + 360 >= poStart.phi && poInter.phi + 360 <= poEnd.phi)
      //   );
      // }
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

/**
 *
 * @param {import("../index").IArc} arc
 * @param {import("../index").ILine[]} lines
 * @param {boolean} ccw Is counter clock wise
 * @returns {import("../index").IArc[] | null} return intersect point or null
 */
export function splitArc(arc, lines, ccw) {
  var arcArray = [arc];
  var dup = [arc.start, arc.end];
  var i = 0;
  while (i < arcArray.length) {
    var ar = arcArray[i];
    var idx = arcArray.indexOf(ar);
    for (var li of lines) {
      var it = inteceptArcLineSeg(ar, li, ccw);
      if (
        it != null &&
        dist(it, ar.start) > 1e-6 &&
        dist(it, ar.end) > 1e-6 &&
        dup.filter((dp) => dist(it, dp) < 1e-6).length == 0
      ) {
        dup.push(it);

        var newArc1 = Object.assign({}, ar, { end: it });
        var newArc2 = Object.assign({}, ar, { start: it });
        if (typeof ar.ord != "undefined") {
          newArc1.ord = newArc1.ord
            .replace(/[XY].[^\s]*/gi, " ")
            .replace(/\s+/, " ");
          newArc2.ord = newArc2.ord
            .replace(/[XY].[^\s]*/gi, " ")
            .replace(/\s+/, " ");
          var ns = newArc1.ord.split(" ").filter((o) => !o.match(/Z/gi));
          ns[1] = `X${it.x} Y${it.y} Z${arc.z} ${ns[1]}`;
          newArc1.ord = ns.filter((o) => o != "").join(" ");
          ns = newArc2.ord.split(" ").filter((o) => !o.match(/Z/gi));
          ns[1] = `X${newArc2.end.x} Y${newArc2.end.y} Z${arc.z} ${ns[1]}`;

          newArc2.ord = ns.filter((o) => o != "").join(" ");
          // recalculate center relative to start point, only newarc2 being effect
          //it.x+vx=center
          var cx = newArc1.center.x - it.x;
          var cy = newArc1.center.y - it.y;
          newArc2.ord = newArc2.ord
            .replace(/[IJ].[^\s]*/gi, "\t")
            .replace(/\t+/, `I${cx} J${cy}`) //replace only one
            .replace(/\t/g, " ") // remover other
            .trim();

          // Object.assign(newArc1, it); //override xy
          // Object.assign(newArc1.end, it); //override xy
          // Object.assign(newArc2.start, it); //override xy
          // Object.assign(newArc2, newArc2.end); //override xy
        }

        var mar = arcArray.map((o, i) => {
          if (i == idx) {
            return [newArc1, newArc2];
          } else {
            return [o];
          }
        });
        mar = [].concat(...mar);
        arcArray = mar;
        i = -1;
        break;
      }
    }
    i++;
  }
  arcArray = arcArray.map((o) => {
    Object.assign(o, { x: o.end.x, y: o.end.y });
    return o;
  });

  return arcArray;
}
