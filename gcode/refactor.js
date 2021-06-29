import * as fs from "fs";
import { Inject, ReflectiveInjector } from "injection-js";
import { DelaunayPlane } from "../autolevel/dx.js";
import { Files } from "../Files.js";
import { GCode } from "./index.js";
import { splitSegment } from "../autolevel/splitSeg.js";

export class RefactorHeightMap {
  static get parameters() {
    return [new Inject(Files), new Inject(GCode), new Inject(DelaunayPlane)];
  }

  /**
   *
   * @param {Files} files
   * @param {GCode} gcode
   * @param {DelaunayPlane} delaunayPlane
   */
  constructor(files, gcode, delaunayPlane) {
    /**
     * @type {Files}
     */
    this._files = files;
    /**
     * @type {GCode}
     */
    this._gcode = gcode;
    /**
     * @type {DelaunayPlane}
     */
    this._delaunayPlane = delaunayPlane;
  }
  generateTriangleGcode(triangles) {
    var str = [].concat(triangles).map((o) => {
      o.push(o[0]);
      var l = null;
      var rs = o
        .map((a) => {
          return `G1 X${a.x} Y${a.y}`;
        })
        .join("\n");
      return `G0 Z5\nG0 X${o[0].x}Y${o[0].y}\nG1 Z-0.1\n${rs}`;
    });
    fs.writeFileSync("./tri.nc", str.join("\n"));
  }
  run(gcodeFile, heightmapFile) {
    var code = this._gcode.loadFile(gcodeFile);

    var counter = 0;
    var seglist = code.data.reduce((a, o, i) => {
      if (o.ord.match(/G0\s/) || o.ord.match(/G00/)) {
        counter++;
      }
      a[counter] = a[counter] || { idx: [], data: [] };
      //   a[counter].idx.push(i);
      if (o.ord.match(/G01/)) {
        o.idx = i;
        a[counter].data.push(o);
      }
      return a;
    }, []);
    var tri = this._delaunayPlane.loadPointsFromFile(heightmapFile);
    this.generateTriangleGcode([].concat(tri.triangles));
    var lines = [].concat(
      ...tri.triangles.map((o) => {
        o.push(o[0]);
        var last = null;
        return o.reduce((x, y, i) => {
          if (last == null) {
          } else {
            x.push([last, y]);
          }
          last = y;
          return x;
        }, []);
      })
    );
    var mpe = seglist
      .filter((o) => o.data.length > 0)
      .reduce((a, b, i) => {
        var last = null;
        var spl = b.data.reduce((x, y) => {
          if (last == null) {
            last = y;
            return x;
          }
          var spl = splitSegment(last, y, ...lines);
          x.push({ from: last, to: y, spl });
          last = y;
          return x;
        }, []);
        a.push(spl);
        return a;
      }, []);
    // join segments
    var lastIdx = undefined;
    var merged = mpe.map((a) => {
      var data = [].concat(
        ...a.map((x, i) => {
          var d = x.spl;
          if (i > 0) {
            d.shift();
          }
          return d;
        })
      );
      return data;
    });
    var joinData = merged
      .reduce((a, b, i) => {
        var from = b[0].idx;
        var to = b[b.length - 1].idx;
        for (var j = from; j <= to; j++) {
          a[j] = null;
        }
        a[from] = b;
        //   var seg1 = a.slice(0, from);
        //   var seg2 = a.slice(to + 1);
        return a;
      }, [].concat(code.data))
      .map((o) => {
        if (o && o.length) {
          return [].concat(...o);
        }
        return [o];
      });
    joinData = []
      .concat(...joinData)
      .filter((o) => o != null)
      .map((o) => {
        if (o.ord) {
          return o;
        }
        o.ord = `G01 X${o.x} Y${o.y} Z${o.z}`;
        return o;
      });
    var outFile = "almod.nc";
    fs.writeFileSync(outFile, joinData.map((o) => o.ord).join("\n"));
    console.log(mpe);
  }
}
