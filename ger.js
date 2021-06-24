#!/usr/bin/env node

import { Gerber } from "./gerber/index.js";
import { inst } from "./init2.js";

/**
 * @type {Gerber}
 */
var ger = inst.get(Gerber); //var container = require("./init");
//container.Gerber();
ger.run();
