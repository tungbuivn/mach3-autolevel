#!/usr/bin/env node
var fs = require("fs");
var path = require("path");

var sourceFile = process.argv[2];
var dir = process.cwd();
// dir="d:\\downloads\\Gerber_PCB_print";
var ext = path.extname(sourceFile);
var noExt = sourceFile.replace(ext, "");
var mapFile = `${dir}/${noExt}.txt`;
var sourceXYZ =
  fs.readFileSync(`${dir}/${sourceFile}`) + "".replace(/\r/gi, "");
var coords = sourceXYZ
  .split("\n")
  .filter((o) => o.match(/G1\sX/i))
  .map((o) => {
    return o
      .split(" ")
      .filter((o) => o.trim() != "" && o.match(/(X|Y)/i))
      .map((o) => o.replace(/(X|Y)/g, ""));
  })
  .slice(1);
var xyz = fs.readFileSync(mapFile) + "";
var arr = xyz.split("\r\n").map((o) => o.split(",")[2]);
var fnData = coords.map((o, i) => {
  o.push(arr[i]);
  return o.join(",");
});
fs.writeFileSync(`${dir}/${noExt}_fixed.txt`, fnData.join("\n"));
// console.log(arr);
