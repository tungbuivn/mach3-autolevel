import { splitArc } from "../autolevel/splitArc.js";

test("splitArc test", () => {
  var rs,
    rs = splitArc(
      { center: { x: 1, y: 0 }, start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
      [{ p1: { x: 1, y: 0 }, p2: { x: 0, y: 1 } }]
    );
  expect(rs);
});
