import { inteceptArcLineSeg } from "../autolevel/splitArc.js";

test("inteceptArcLineSeg", () => {
  var rs;
  rs = inteceptArcLineSeg(
    { center: { x: 1, y: 0 }, start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    { p1: { x: 1, y: 0 }, p2: { x: 0, y: 1 } }
  );
  expect(!!rs).toBe(true);
  rs = inteceptArcLineSeg(
    { center: { x: 1, y: 0 }, start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    { p1: { x: 1, y: 0 }, p2: { x: 2, y: 1 } }
  );
  expect(rs).toBe(null);
  rs = inteceptArcLineSeg(
    { center: { x: 1, y: 0 }, start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    { p1: { x: 1, y: 0 }, p2: { x: -5, y: -1e9 } }
  );
  expect(rs).toBe(null);
  rs = inteceptArcLineSeg(
    { center: { x: 1, y: 0 }, start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    { p1: { x: 1, y: 0 }, p2: { x: 2, y: -1 } }
  );
  expect(rs).toBe(null);
  rs = inteceptArcLineSeg(
    {
      center: { x: 0, y: 0 },
      start: {
        x: Math.cos((45 * Math.PI) / 180),
        y: Math.sin((45 * Math.PI) / 180),
      },
      end: {
        x: Math.cos((45 * Math.PI) / 180),
        y: -Math.sin((45 * Math.PI) / 180),
      },
    },
    { p1: { x: 0, y: 0 }, p2: { x: 1, y: 0 } }
  );
  expect(rs.x == 1 && rs.y == 0).toBe(true);

  rs = inteceptArcLineSeg(
    { center: { x: 1, y: 0 }, start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    { p1: { x: 1, y: 0 }, p2: { x: 0, y: 1 } },
    true
  );
  expect(rs).toBe(null);
});
