import { RpfGenerator } from "../autolevel/genrpf.js";
import { inst } from "../init2.js";

test("test gen file", () => {
  //   var { RpfGenerator, inst } = await Promise.all(all);
  expect(inst);
  var svc = inst.get(RpfGenerator);
  expect(svc).toBeInstanceOf(RpfGenerator);
});
