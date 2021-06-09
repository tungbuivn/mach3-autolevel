var delaunay = require("faster-delaunay");
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

loadGCode("./top.nc");
