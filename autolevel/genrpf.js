import * as fs from "fs";
import path from "path";
import { Inject, Injectable, ReflectiveInjector } from "injection-js";
import { Config } from "../config2.js";

import { GCode } from "../gcode/index.js";
import { fmt } from "./fmt.js";
// var di = require("injection-js");

// var Http = di.Class({
//   constructor: function () {},
// });

export class RpfGenerator {
  static get parameters() {
    return [new Inject(Config), new Inject(GCode)];
  }

  constructor(config, gcode) {
    // Object.assign(this, { config, gcode });
    /**
     * @type {Config}
     */
    this.config = config;
    /**
     * @type {GCode}
     */
    this.gcode = gcode;
  }
  // /**
  //  * @type {GCode}
  //  */
  // get gcode() {
  //   return this._gcode;
  // }
  genFile(inFile) {
    //   var inFile = process.argv[2];
    // var ct = fs.readFileSync(inFile) + "";
    // ct = ct
    //   .split(/[\r\n]/g)
    //   .filter((o) => !o.match(/^\(/))
    //   .filter((o) => o != "");
    // var z = NaN;
    // var x = NaN;
    // var y = NaN;
    // var mi = { x: 1e6, y: 1e6, z: 1e6 },
    //   ma = { x: -1e6, y: -1e6, z: -1e6 };
    // function getXY(s) {
    //   s.split(/\s+/)
    //     .filter((o) => o.match(/[XY]/gi))
    //     .map((p) => p.split(/[XY]/gi));
    // }
    // var appendZ = ct.reduce((a, b) => {
    //   var c = b + " ";
    //   c = c.replace(/([XYZ]+.[^\sXYZ]*)/gi, " $1 ");
    //   if (c.match(/\sZ/gi)) {
    //     z = c
    //       .split(" ")
    //       .filter((o) => o.match(/z/gi))[0]
    //       .split(/z/gi)[1];
    //   }
    //   if (c.match(/\sy/gi)) {
    //     y = c
    //       .split(" ")
    //       .filter((o) => o.match(/y/gi))[0]
    //       .split(/y/gi)[1];
    //   }
    //   if (c.match(/\sx/gi)) {
    //     x = c
    //       .split(" ")
    //       .filter((o) => o.match(/x/gi))[0]
    //       .split(/x/gi)[1];
    //   }
    //   if (c.match(/[XY]/gi)) {
    //     c = c + " Z" + z + " ";
    //   }
    //   var xyz = { x: parseFloat(x), y: parseFloat(y), z: parseFloat(z) };
    //   mi = {
    //     x: Math.min(mi.x, xyz.x || 1e6),
    //     y: Math.min(mi.y, xyz.y || 1e6),
    //     z: Math.min(mi.z, xyz.z || 1e6),
    //   };
    //   ma = {
    //     x: Math.max(ma.x, xyz.x || -1e6),
    //     y: Math.max(ma.y, xyz.y || -1e6),
    //     z: Math.max(ma.z, xyz.z || -1e6),
    //   };
    //   a.push(Object.assign({ ord: b }, xyz));
    //   return a;
    // }, []);
    var gdata = this.gcode.loadFile(inFile);

    var mi = gdata.min,
      ma = gdata.max,
      dx = ma.x - mi.x,
      dy = ma.y - mi.y,
      countSegX = Math.floor(dx / 10),
      countSegY = Math.floor(dy / 10);
    mi.x = mi.x - 1;
    mi.y = mi.y - 1;
    ma.x = ma.x + 1;
    ma.y = ma.y + 1;
    if (countSegX == 0) countSegX = 1;
    if (countSegY == 0) countSegY = 1;

    var lenX = dx / countSegX,
      lenY = dy / countSegY;

    var po = [].concat(
      ...Array.from(new Array(countSegY + 1)).map((o, j) => {
        var ar = [].concat(
          ...Array.from(new Array(countSegX + 1)).map((o, i) => {
            var rs = [];
            if (i < countSegX && j < countSegY) {
              rs.push({
                x: mi.x + (i * dx) / countSegX + lenX / 2,
                y: mi.y + (j * dy) / countSegY + lenY / 2,
              });
            }
            return [].concat(
              [
                {
                  x: mi.x + (i * dx) / countSegX,
                  y: mi.y + (j * dy) / countSegY,
                },
              ],
              rs
            );
          })
        );

        if ((j + 1) % 2 == 0) {
          ar.reverse();
        }
        return ar;
      })
    );
    console.log("Min:", mi);
    console.log("Max:", ma);
    // var dist = Math.sqrt(dx * dx + dy * dy);
    var probeSpeed = this.config.probeSpeed;
    var probeZSpeed = 20;
    function GenCNC() {
      return po
        .map((o) => {
          return `G1 Z3 F${probeSpeed}
G1 X${fmt(o.x)} Y${fmt(o.y)} F${probeSpeed}
G31 Z-1 F20`;
        })
        .join("\n");
    }
    var str = GenCNC();
    var out = `G90 G21 S20000 G17
M0 (Attach probe wires and clips that need attaching)
(Initialize probe routine)



G31 Z-99 F20 (Probe to a maximum of the specified probe height at the specified feed rate)
G92 Z0 (Touch off Z to 0 once contact is made)
G1 Z3 F${probeSpeed} (Move Z to above the contact point)
G31 Z-1 F20 (Repeat at a more accurate slower rate)
G92 Z0
G1 Z5 F${probeSpeed}


M40 (Begins a probe log file, when the window appears, enter a name for the log file such as "RawProbeLog.txt")
${str}
G1 Z5 F${probeSpeed}


M41 (Closes the opened log file)
G0 X0 Y0 Z5
M0 (Detach any clips used for probing)
M30
`;
    var waitMoving = `
While (IsMoving())
  Sleep(100)
Wend
`;
    var saveCoord = `
xd00d=getoemdro (800)
yd00d=getoemdro (801)
zd00d=getoemdro (802)

'write some example text to the file
Print #iFileNo,  xd00d, ",",yd00d,",",zd00d
`;

    console.info("Generate file ...");
    fs.writeFileSync("./rpf.nc", out);
    var txtFile = path.resolve("./rpfmap.txt");
    function GenScripts() {
      return po
        .map((o) => {
          return `
          CODE "G0 Z5"
          ${waitMoving}
CODE "G1 X${fmt(o.x)} Y${fmt(o.y)} F${probeSpeed}"
${waitMoving}
CODE "G31 Z-1 F20"
${waitMoving}
${saveCoord}
`;
        })
        .join("\n");
    }
    out = `
    MsgBox ( "Press enter any key to start" )

    CODE "G90 G21 S20000 G17"
    CODE "G1 X${po[0].x} Y${po[0].y} F${probeSpeed}"
   ${waitMoving}
    CODE "G31 Z-99 F20"
    ${waitMoving}
    CODE "G92 Z0"
    CODE "G0 Z2"
    ${waitMoving}
    CODE "G31 Z-1 F20"
    ${waitMoving}
    CODE "G92 Z0"
    CODE "G0 Z5"
    ${waitMoving}
    Dim sFileText As String
    Dim iFileNo As Integer
    iFileNo = FreeFile
    'open the file for writing
    Open "${txtFile}" For Output As #iFileNo
    'please note, if this file already exists it will be overwritten!
    
   ${GenScripts()}
    
    'close the file (if you dont do this, you wont be able to open it again!)
    Close #iFileNo
        `;
    //   console.log(appendZ);
    // fs.writeFileSync("./rpf.m1s", out);

    function GenLsp() {
      return po
        .map((o) => {
          return `"${fmt(o.x)},${fmt(o.y)}"`;
        })
        .join(" ");
    }
    fs.writeFileSync("./lsprpf.lsp", `(command "pline" ${GenLsp()} "")`);
  }
}
// var RpfGenerator = di.Class({
//   constructor: [
//     require("../config2"),
//     function (config) {
//       console.log(config);
//       this.GenFile = GenFile;
//     },
//   ],
// });
// function GenFile(inFile) {}
// var inFile = process.argv[2];
// GenFile(inFile);
//module.exports = RpfGenerator;
