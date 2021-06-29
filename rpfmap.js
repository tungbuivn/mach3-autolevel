#!/usr/bin/env node

import { inst as di } from "./init2.js";
import { RefactorHeightMap } from "./gcode/refactor.js";
// console.log(di.get(require("./autolevel/genrpf")));
var ref = di.get(RefactorHeightMap);
var inFile = process.argv[2] || "";
var heightmapFile = process.argv[3] || "";

ref.run(inFile, heightmapFile);
