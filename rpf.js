import { inst as di } from "./init2.js";
import { RpfGenerator } from "./autolevel/index.js";
// console.log(di.get(require("./autolevel/genrpf")));
var gen = di.get(RpfGenerator);
var inFile = process.argv[2] || "";

if (inFile == "") {
  throw new Error("Missing input file");
}
gen.GenFile(inFile);
