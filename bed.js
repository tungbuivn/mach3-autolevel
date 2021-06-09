var delaunay = require("faster-delaunay");
var pointInPolygon = require("point-in-polygon");
var intersects = require("./intersects");
var fs = require("fs");
function extractPoint(s) {
  var p = s.match(/(x|y|z)([+-]?.*)/i);
  var obj = {};
  if (p) {
    obj[p[1].toUpperCase()] = parseFloat(p[2]);
  }

  return obj;
}

/**
 * @type {Array.<import("./docs").ISourceLine>}
 */
var sourceLines;
/**
 *
 * @param {String} file
 * @returns {Array.<import("./docs").ISourceLine>}
 */
function loadGCode(file) {
  var s = fs.readFileSync(file) + "";

  sourceLines = s
    .replace(/(?:\\[rn]|[\r\n]+)+/g, String.fromCharCode(0))
    .split(String.fromCharCode(0))
    .map((o, i) => {
      return {
        idx: i,
        str: o,
      };
    });

  var lastX = 999999,
    lastY = 999999,
    lastZ = NaN;
  var arr = sourceLines
    .filter((src) => {
      return (
        !src.str.match(/^\(/) &&
        src.str.split(/\s+/g).filter((s) => s.match(/(?:x|y|z)/gi)).length
      );
    })
    .map((src) => {
      src.str
        .split(/\s+/g)
        .filter((o) => o.match(/(?:x|y|z)/gi))
        .forEach((s) => {
          if (s.match(/x/i)) {
            lastX = extractPoint(s).X;
          } else if (s.match(/y/i)) {
            lastY = extractPoint(s).Y;
          } else if (s.match(/z/i)) {
            lastZ = extractPoint(s).Z;
          }
        });
      src.X = lastX;
      src.Y = lastY;
      src.Z = lastZ;
      return src;
    });
  return arr;
}

var data = loadGCode("./top.nc");
var dn = delaunay(
  data.map((o) => {
    return [o.X, o.Y, o.Z, o];
  })
);
var faces = dn.triangulate();
var groups = {};
faces.forEach((o, i) => {
  var idx = (i / 3) >> 0;
  groups[idx] = groups[idx] || [];
  groups[idx].push(o);
});
var points = Object.keys(groups).map((key) => {
  return groups[key].map((o) => o[3]);
});
var polygon = [
  [0, 0],
  [1, 0],
  [Math.sqrt(2), Math.sqrt(2)],
];
var x = pointInPolygon([1, 0], polygon);
console.log(x); // true

console.log(faces);
