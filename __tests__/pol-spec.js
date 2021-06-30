import { pol } from "../autolevel/pol.js";

test("polar function", () => {
  var rs;
  //   rs = pol({ dx: 0, dy: 0 });
  expect(() => {
    pol({ dx: 0, dy: 0 });
  }).toThrow(Error);
  rs = pol({ dx: 1, dy: 0 });
  expect(rs.phi).toBe(0);
  rs = pol({ dx: 1, dy: 1 });
  expect(rs.phi).toBe(45);
  rs = pol({ dx: 0, dy: 1 });
  expect(rs.phi).toBe(90);
  rs = pol({ dx: -1, dy: 1 });
  expect(rs.phi).toBe(135);
  rs = pol({ dx: -1, dy: 0 });
  expect(rs.phi).toBe(180);
  rs = pol({ dx: -1, dy: -1 });
  expect(rs.phi).toBe(180 + 45);
  rs = pol({ dx: 0, dy: -1 });
  expect(rs.phi).toBe(270);
  rs = pol({ dx: 1, dy: -1 });
  expect(rs.phi).toBe(270 + 45);
  rs = pol({ dx: 1, dy: 0 });
  expect(rs.phi).toBe(0);
});
