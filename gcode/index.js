import fs from "fs";
import { GCodeData } from "../models/index.js";

export class GCode {
  constructor() {}
  loadFile(fileName) {
    var ct = fs.readFileSync(fileName) + "";
    ct = ct.split(/[\r\n]/g);
    this._lines = ct;
    var z = NaN;
    var x = NaN;
    var y = NaN;
    var mi = { x: 1e6, y: 1e6, z: 1e6 },
      ma = { x: -1e6, y: -1e6, z: -1e6 };
    var appendZ = ct
      .filter((o) => !o.match(/^\(/))
      .filter((o) => o != "")
      .reduce((a, b) => {
        var c = b + " ";
        c = c.replace(/([XYZ]+.[^\sXYZ]*)/gi, " $1 ");
        if (c.match(/\sZ/gi)) {
          z = c
            .split(" ")
            .filter((o) => o.match(/z/gi))[0]
            .split(/z/gi)[1];
        }
        if (c.match(/\sy/gi)) {
          y = c
            .split(" ")
            .filter((o) => o.match(/y/gi))[0]
            .split(/y/gi)[1];
        }
        if (c.match(/\sx/gi)) {
          x = c
            .split(" ")
            .filter((o) => o.match(/x/gi))[0]
            .split(/x/gi)[1];
        }
        if (c.match(/[XY]/gi)) {
          c = c + " Z" + z + " ";
        }
        var xyz = { x: parseFloat(x), y: parseFloat(y), z: parseFloat(z) };
        mi = {
          x: Math.min(mi.x, xyz.x || 1e6),
          y: Math.min(mi.y, xyz.y || 1e6),
          z: Math.min(mi.z, xyz.z || 1e6),
        };
        ma = {
          x: Math.max(ma.x, xyz.x || -1e6),
          y: Math.max(ma.y, xyz.y || -1e6),
          z: Math.max(ma.z, xyz.z || -1e6),
        };
        a.push(Object.assign({ ord: b }, xyz));
        return a;
      }, []);

    return new GCodeData(mi, ma, appendZ);
  }
}
