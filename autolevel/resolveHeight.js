function equation_plane(x1, y1, z1, x2, y2, z2, x3, y3, z3) {
  var a1 = x2 - x1;
  var b1 = y2 - y1;
  var c1 = z2 - z1;
  var a2 = x3 - x1;
  var b2 = y3 - y1;
  var c2 = z3 - z1;
  var a = b1 * c2 - b2 * c1;
  var b = a2 * c1 - a1 * c2;
  var c = a1 * b2 - b1 * a2;
  var d = -a * x1 - b * y1 - c * z1;
  // document.write("equation of plane is " + a + " x + "        + b + " y + " + c + " z + " + d + " = 0.");
  return { a, b, c, d };
}
/**
 * findLinePlaneIntersectionCoords (to avoid requiring unnecessary instantiation)
 * Given points p with px py pz and q that define a line, and the plane
 * of formula ax+by+cz+d = 0, returns the intersection point or null if none.
 */
function findLinePlaneIntersectionCoords(px, py, pz, qx, qy, qz, a, b, c, d) {
  // var nx=(a*qx+b*qy+c*qz);
  //     t=-d-(c1*px +a1*py+b1*pz)
  var tDenom = a * (qx - px) + b * (qy - py) + c * (qz - pz);
  if (tDenom == 0) return null;

  var t = -(a * px + b * py + c * pz + d) / tDenom;

  return {
    x: px + t * (qx - px),
    y: py + t * (qy - py),
    z: pz + t * (qz - pz),
  };
}
function pointInTriangle(point, triangle) {
  //compute vectors & dot products
  var cx = point[0],
    cy = point[1],
    t0 = triangle[0],
    t1 = triangle[1],
    t2 = triangle[2],
    v0x = t2[0] - t0[0],
    v0y = t2[1] - t0[1],
    v1x = t1[0] - t0[0],
    v1y = t1[1] - t0[1],
    v2x = cx - t0[0],
    v2y = cy - t0[1],
    dot00 = v0x * v0x + v0y * v0y,
    dot01 = v0x * v1x + v0y * v1y,
    dot02 = v0x * v2x + v0y * v2y,
    dot11 = v1x * v1x + v1y * v1y,
    dot12 = v1x * v2x + v1y * v2y;

  // Compute barycentric coordinates
  var b = dot00 * dot11 - dot01 * dot01,
    inv = b === 0 ? 0 : 1 / b,
    u = (dot11 * dot02 - dot01 * dot12) * inv,
    v = (dot00 * dot12 - dot01 * dot02) * inv;
  return u >= 0 && v >= 0 && u + v <= 1;
}

export function resolveHeight(p, a, b, c) {
  var inTri = pointInTriangle(
    [p.x, p.y],
    [
      [a.x, a.y],
      [b.x, b.y],
      [c.x, c.y],
    ]
  );
  if (!inTri) {
    // var inTri = MathFunctions2.triangleContainsPoint(a, b, c, p);
    return null;
  }
  var plane = equation_plane(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
  var rs = findLinePlaneIntersectionCoords(
    p.x,
    p.y,
    0,
    p.x,
    p.y,
    1,
    plane.a,
    plane.b,
    plane.c,
    plane.d
  );

  return rs;
}

// var rs = resolveHeight(
//   { x: 5, y: 5 },
//   { x: 0, y: 0, z: 0 },
//   { x: 1, y: 1, z: 0.5 },
//   { x: 1, y: 0, z: 0.5 }
// );
// console.log(rs);
