#!/usr/bin/env node

import fs from "fs";
import * as path from "path";
import { GCode } from "./gcode/index.js";



import { inst as di } from "./init2.js";

// console.log(di.get(require("./autolevel/genrpf")));
/**
 * @type {GCode}
 */
var gcode = di.get(GCode);
// var fs = require("fs");
// var path = require("path");
var file = process.argv[2];
var cutDepth = "0.5";
var prevIsZ5 = false;
// d:\0cnc\app\top.nc
var str = fs.readFileSync(file) + "";
var gdata=gcode.loadFromStr(str);
var org = gdata.data.map(o=>o.ord);//str.split("\n");
// console.log(org)
var maxHeight = org
  .filter((s) => !s.match(/^\(/))
  .map((s) => s.match(/Z(\d+)/))
  .filter((o) => o != null)
  .map((o) => parseInt(o[1]))
  .reduce((a, b) => Math.max(a, b), -1);
// maxHeight=5;
var feedRate = 100;
var cutXYFeedRate = 500;
console.log("Initialize height:", maxHeight);
org.push("");
for (var frate of org) {
  if (frate.match(/\(/)) continue;
  if (frate.match(/\sF/)) {
    cutXYFeedRate = frate.match(/\sF\d+/)[0].match(/\d+/)[0];
    console.log("Feed rate: ", cutXYFeedRate, frate);
    break;
  }
}
var reMaxHeight=new RegExp(`Z${maxHeight}`,"gi");
var newArr = org.map((s, idx) => {
  s = s.replace(/\r/, "");
  var z5 = false;
  if (prevIsZ5) {
    prevIsZ5 = false;
    z5 = true;
  }
  var ar = [];
  var nl = "\n";
  // s=s.replace(/^G1\sZ1/,"G0 Z1")

  if (
    s == `Z${maxHeight}` ||
    s == `G1 Z${maxHeight}` ||
    s == `Z${maxHeight}.` ||
    s == `G1 Z${maxHeight}.` || s.match(reMaxHeight)
  ) {
    prevIsZ5 = true;
    if ((s == `Z${maxHeight}`)|| s.match(reMaxHeight)) {
      // console.log(s)
      if (!s.match(/^G43/i)) {
        s=s.replace(/^G.[^\s]*/i,"").split(" ").filter(o=>!o.match(/^F/gi)).join(" ")
        ar.push(`G0 ${s}\n`);
      } else {
        ar.push(s+"\n");
      }
      
    } else {
      ar.push(`G0 Z${maxHeight}\n`);
    }
  } else if (s.substring(0, 2) == `Z-`) {
    if (org[idx + 1].substring(0, 1) == "Z") {
      ar.push(`${s}\n`);
    } else {
      // console.log(`${s}\t\t\t`);
      ar.push(`G1 ${s.split(" ")[0]} F${feedRate}\n`);
    }
  } else if (s == "Z1" || s == "Z1.") {
    ar.push(`G1 ${s} F${feedRate}\n`);
  } else {
    if (z5 &&(s[0] == "G" || s[0] == "X" || s[0] == "Y" || s[0] == "Z")) {
      var re=s.replace(/^G.[^\s]*/,"").split(" ").filter(o=>!o.match(/^F/gi)).join(" ")
      ar.push(`G0 ${re}\n`);
    } else {
      ar.push(`${s}\n`);
    }
  }

  return ar;
});
var armg = [].concat(...newArr);
newArr = armg.map((s, i) => {
  var ar = [`${s}`];
  if (s.match(/z/gi)) {
    if (armg[i + 1] || false) {
      if (!armg[i + 1].match(/z/gi)) {
        // console.log("not mach",i,"    ",i+1)
        ar.push(`F${cutXYFeedRate}\n`);
      }
    }
  }
  return ar;
});

var sar = [].concat(...newArr).join("");
fs.writeFileSync(path.dirname(file) + "/out.nc", sar);
