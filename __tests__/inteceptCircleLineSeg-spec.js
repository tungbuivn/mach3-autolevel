import { inteceptCircleLineSeg } from "../autolevel/splitArc";

test("inteceptCircleLineSeg", function () {
  var rs = inteceptCircleLineSeg(
    { center: { x: 1, y: 0 }, radius: 1 },
    { p1: { x: 1, y: 0 }, p2: { x: 1, y: 3 } }
  );
  expect(rs.length).toBe(1);
  expect(rs[0].x == 1 && rs[0].y == 1).toBe(true);
  rs = inteceptCircleLineSeg(
    { center: { x: 1, y: 0 }, radius: 1 },
    { p1: { x: 1, y: 0 }, p2: { x: 0, y: 1 } }
  );
  expect(rs[0].x - 0.2928932188134524 == rs[0].y - 0.7071067811865476).toBe(
    true
  );
  rs = inteceptCircleLineSeg(
    { center: { x: 1, y: 0 }, radius: 1 },
    { p1: { x: 1, y: 0 }, p2: { x: 1, y: 0.99 } }
  );
  expect(rs.length == 0).toBe(true);
});
