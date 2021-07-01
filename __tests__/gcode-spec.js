import { GCode } from "../gcode/index.js";
import { inst } from "../init2.js";

test("test gen file", () => {
  //   var { RpfGenerator, inst } = await Promise.all(all);
  expect(inst);
  var svc = inst.get(GCode);
  expect(svc).toBeInstanceOf(GCode);
  svc.loadFile("./__tests__/data/cir.nc");
});
