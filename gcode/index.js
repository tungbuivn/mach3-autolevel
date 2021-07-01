import fs from "fs";
import { GCodeData } from "../models/index.js";

export class GCode {
  constructor() {}

  loadFile(fileName) {
    var ct = fs.readFileSync(fileName) + "";
    ct = ct.replace(/[\r\n]/g, "\t").split(/\t+/g);
    // this._lines = ct;

    return this.normalize(
      new GCodeData(
        null,
        null,
        ct.map((o) => {
          return { ord: o };
        })
      )
    );
  }
  extractNum(str, char) {
    var re = new RegExp(char, "gi");
    str = str.replace(/;.*$/, "");
    var fo = str.split(" ").filter((o) => o.match(re));
    if (fo.length) {
      var fl = parseFloat(fo[0].split(re)[1]);
      var rs = {};
      rs[char] = fl;
      return rs;
    }
    return {};
  }
  /**
   *
   * @param {GCodeData} gcodedata
   * @returns {GCodeData}
   */
  normalize(gcodedata) {
    var z = NaN;
    var x = NaN;
    var y = NaN;
    var last = { x: NaN, y: NaN, z: NaN };
    var mi = { x: 1e6, y: 1e6, z: 1e6 },
      ma = { x: -1e6, y: -1e6, z: -1e6 };
    var ct = gcodedata.data.map((o) => o.ord);
    var appendZ = ct
      .filter((o) => !o.match(/^\(/))
      .filter((o) => o != "")
      .reduce((a, b) => {
        var c = b + " ";
        var xyz = {};
        c = c
          .replace(/([XYZIJR])/gi, " $1")
          .replace(/\s+/gi, " ")
          .trim();
        var current = Object.assign({}, last);
        Object.assign(
          last,
          this.extractNum(c, "x"),
          this.extractNum(c, "y"),
          this.extractNum(c, "z")
        );
        Object.assign(
          xyz,
          last,

          this.extractNum(c, "i"),
          this.extractNum(c, "j"),
          this.extractNum(c, "k")
        );

        // if (c.match(/\sx/gi)) {
        //   x = c
        //     .split(" ")
        //     .filter((o) => o.match(/x/gi))[0]
        //     .split(/x/gi)[1];
        // }
        // if (c.match(/\sZ/gi)) {
        //   z = c
        //     .split(" ")
        //     .filter((o) => o.match(/z/gi))[0]
        //     .split(/z/gi)[1];
        // }
        // if (c.match(/\sy/gi)) {
        //   y = c
        //     .split(" ")
        //     .filter((o) => o.match(/y/gi))[0]
        //     .split(/y/gi)[1];
        // }

        // Object.assign(xyz, {
        //   x: parseFloat(x),
        //   y: parseFloat(y),
        //   z: parseFloat(z),
        // });
        if (c.match(/^G0?[23]/gi)) {
          xyz.ccw = !!c.match(/^G03/gi);
          if (typeof xyz.i == "undefined") xyz.i = 0;
          if (typeof xyz.j == "undefined") xyz.j = 0;
          if (typeof xyz.k == "undefined") xyz.k = 0;

          xyz.center = { x: current.x + xyz.i, y: current.y + xyz.j };
          xyz.start = Object.assign({}, current);
        }

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
        a.push(Object.assign({ ord: c }, xyz));
        return a;
      }, []);
    return new GCodeData(mi, ma, appendZ);
  }
}
