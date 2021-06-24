import fs from "fs";
import * as path from "path";
// var fs = require("fs");
// var path = require("path");
var file = process.argv[2];
var cutDepth = "0.5";
var prevIsZ5 = false;
// d:\0cnc\app\top.nc
var str = fs.readFileSync(file) + "";
var org = str.split("\n");
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
    s == `G1 Z${maxHeight}.`
  ) {
    prevIsZ5 = true;
    if (s == `Z${maxHeight}`) {
      ar.push(`G0 ${s}\n`);
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
    if (z5 && (s[0] == "X" || s[0] == "Y" || s[0] == "Z")) {
      ar.push(`G0 ${s}\n`);
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
