// require("reflect-metadata");
import * as di from "injection-js";
import { RpfGenerator } from "./autolevel/index.js";
import { Config } from "./config2.js";
import { Files } from "./Files.js";
import { Gerber } from "./gerber/gerber.js";
import { Hole } from "./gerber/hole.js";
import { GCode } from "./gcode/index.js";

var inst = di.ReflectiveInjector.resolveAndCreate([
  Config,
  RpfGenerator,
  Gerber,
  Files,
  Hole,
  GCode,
]);

/**
 * @type {import(".").Inst}
 */
export var inst;
//module.exports = inst;
