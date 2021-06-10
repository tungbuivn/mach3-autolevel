var delaunay = require("faster-delaunay");
var pointInPolygon = require("point-in-polygon");
var intersects = require("intersects");

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

var points = faces.reduce((a, b, i) => {
  var idt = (i / 3) >> 0;
  a[idt] = a[idt] || [];
  a[idt].push(b);

  return a;
}, []);

function lineToLine(x1, y1, x2, y2, x3, y3, x4, y4) {
  var s1_x = x2 - x1;
  var s1_y = y2 - y1;
  var s2_x = x4 - x3;
  var s2_y = y4 - y3;
  var s = (-s1_y * (x1 - x3) + s1_x * (y1 - y3)) / (-s2_x * s1_y + s1_x * s2_y);
  var t = (s2_x * (y1 - y3) - s2_y * (x1 - x3)) / (-s2_x * s1_y + s1_x * s2_y);
  return {
    inter: s > 0 && s < 1 && t > 0 && t < 1,
    s: s,
    t: t,
    x: x1 + s1_x * t,
    y: y1 + s1_y * t,
  };
}
function interSeg(a, b, c, d) {
  var rs = lineToLine(a.x, a.y, b.x, b.y, c.x, c.y, d.x, d.y);
  if (rs.inter) {
    var p = { x: rs.x, y: rs.y, mid: true };
    return [
      [a, p],
      [p, b],
    ];
  }
  return [[a, b]];
}

function splitSegment(a, b, ...lines) {
  // rsx,y
  var sources = [a, b];
  var i = 0;
  label_repeat: while (i <= sources.length - 2) {
    var idx = i;
    var p3 = sources[idx];
    var p4 = sources[idx + 1];
    for (var p of lines) {
      var c = p[0];
      var d = p[1];
      var ri = interSeg(p3, p4, c, d);
      if (ri.length > 1) {
        var p1 = sources.slice(0, idx + 1);
        var p2 = sources.slice(idx + 1);

        sources = p1.concat(ri[0][1], p2);
        i = -1;
        break;
      }
    }
    i++;
  }
  return sources;
}

var spl = splitSegment(
  { x: -1, y: 0.5, start: true },
  { x: 0.7, y: 0.5, end: true },
  [
    { x: 0, y: 0 },
    { x: 0, y: 5 },
  ],
  [
    { x: 1, y: 0 },
    { x: 1, y: 5 },
  ]
);

console.log(faces);
