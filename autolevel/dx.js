import Delaunator from "delaunator/index.js";
import * as fs from "fs";
export class DelaunayPlane {
  /**
   *
   * @param {Array.<import("../index").IPoint2D>} points
   */
  constructor() {}
  loadPointsFromFile(fileName) {
    var str = fs.readFileSync(fileName) + "";
    var pos = str
      .replace(/[\r\n]/gi, "===split===")
      .split("===split===")
      .filter((o) => o.trim() != "")
      .map((o) => {
        var xyz = o.split(",");
        var ps = parseFloat(xyz[2]);
        if (isNaN(ps)) {
          ps = 1e-10;
          throw new Error("=== Invalid coordinates !!!");
        }
        return {
          x: parseFloat(xyz[0]),
          y: parseFloat(xyz[1]),
          z: ps,
        };
      });
    /**
     * @type {Array.<import("../index").IPoint2D>}
     */
    // this.points = pos;

    var flat = [].concat(...pos.map((o) => [o.x, o.y]));
    // pos = [].concat(...pos);
    // this.mapPoints = points.reduce((a, b) => {
    //   a.push([b.x, b.y]);
    //   return a;
    // }, []);

    var delaunay = new Delaunator(flat);
    var tri = delaunay.triangles.reduce((a, b, i) => {
      var idx = (i / 3) >> 0;
      a[idx] = a[idx] || [];
      a[idx].push(b);
      return a;
    }, []);
    var triangles = tri.map((o) => o.map((q) => pos[q]));
    return {
      points: pos,
      triangles: triangles,
    };
  }
  sign(p1, p2, p3) {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
  }

  pointInTriangle(pt, v1, v2, v3) {
    var d1, d2, d3, has_neg, has_pos;

    d1 = sign(pt, v1, v2);
    d2 = sign(pt, v2, v3);
    d3 = sign(pt, v3, v1);

    has_neg = d1 < 0 || d2 < 0 || d3 < 0;
    has_pos = d1 > 0 || d2 > 0 || d3 > 0;

    return !(has_neg && has_pos);
  }
  /**
   *
   * @param {number} x
   * @param {number} y
   * @returns height from heightmap
   */
  getPointHeight(x, y) {
    for (var plane of this.delaunay.triangles) {
      var found = false;
      if (found) {
        return found;
      }
    }
    return null;
  }
  splitLines(p1, p2) {}
}
