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
function resolveZ(rs, c, d) {
  var vax = d.x - c.x,
    vay = d.y - c.y,
    vaz = d.z - c.z,
    z = NaN,
    t = NaN;
  if (vax != 0) {
    t = (rs.x - c.x) / vax;
  } else if (vay != 0) {
    t = (rs.y - c.y) / vay;
  }
  z = c.z + vaz * t;
  return z;
}
function interSeg(a, b, c, d) {
  var rs = lineToLine(a.x, a.y, b.x, b.y, c.x, c.y, d.x, d.y);
  if (rs.inter) {
    //calculate z value

    var vz = resolveZ(rs, c, d);

    var p = {
      x: rs.x,
      y: rs.y,
      z: resolveZ(rs, a, b),
      resolvedZ: vz,
      mid: true,
    };
    return [
      [a, p],
      [p, b],
    ];
  }
  return [[a, b]];
}
function dist(a, b) {
  var x = a.x - b.x,
    y = a.y - b.y;
  return Math.sqrt(x * x + y * y);
}

export function splitSegment(a, b, ...lines) {
  // rsx,y
  try {
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
          if (dist(...ri[0]) > 1e-6 && dist(...ri[1]) > 1e-6) {
            var p1 = sources.slice(0, idx + 1);
            var p2 = sources.slice(idx + 1);

            sources = p1.concat(ri[0][1], p2);
            i = -1;
            break;
          }
        }
      }
      i++;
    }
  } catch (e) {
    console.error(e);
  }
  return sources;
}

//   var spl = splitSegment(
//     { x: -1, y: 0.5, start: true },
//     { x: 5, y: 0.5, end: true },
//     [
//       { x: 0, y: 0 },
//       { x: 0, y: 5 },
//     ],
//     [
//       { x: 1, y: 0 },
//       { x: 1, y: 5 },
//     ],
//     [
//       { x: 3, y: 0 },
//       { x: 3, y: 5 },
//     ]
//   );
// export function splitSeg(line, segs) {}
