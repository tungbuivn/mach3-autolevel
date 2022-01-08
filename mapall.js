#!/usr/bin/env node

import {spawnSync} from "child_process"
import { existsSync } from "fs";
// var sps=require("child_process").spawnSync;
var filemap=process.argv[2];
var lstFiles=["/bottom_layer.nc",
"/cutout.nc",
"/drill.nc",
"/drill_1mm.nc",
"/drill_mill.nc"].map(o=>`${process.cwd()}${o}`)
.filter(f=>existsSync(f))
.map(f=>[f,filemap]);
console.log(lstFiles)
lstFiles.forEach(f=>{
    spawnSync("rpfmap.cmd",f);
})
// sps("node.exe",["./rpfmap.js",])