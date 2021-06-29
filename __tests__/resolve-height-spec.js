import { resolveHeight } from "../autolevel/resolveHeight.js";
test("test plane height", () => {
  
  //   var { RpfGenerator, inst } = await Promise.all(all);
  var rs = resolveHeight(
    { x: 0.5, y: 0.5 },
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 1, z: 0.5 },
    { x: 1, y: 0, z: 0 }
  );
  expect(rs.z).toBe(0.25);

  rs = resolveHeight(
    { x: 0, y: 0 },
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 1, z: 0.5 },
    { x: 1, y: 0, z: 0 }
  );
  expect(rs.z).toBe(0);
  rs = resolveHeight(
    { x: 1, y: 1 },
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 1, z: 0.5 },
    { x: 1, y: 0, z: 0 }
  );
  expect(rs.z).toBe(0.5);
  rs = resolveHeight(
    { x: 2, y: 2 },
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 1, z: 0.5 },
    { x: 1, y: 0, z: 0 }
  );
  expect(rs).toBe(null);
  rs = resolveHeight(
    { x: 0.2, y: 0.2 },
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 1, z: 0.5 },
    { x: 1, y: 0, z: 0 }
  );
  expect(rs.z).toBe(0.1);
});
