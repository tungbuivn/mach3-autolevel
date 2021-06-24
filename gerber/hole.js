import * as fs from "fs";
import { Inject } from "injection-js";
import { Config } from "../config2.js";
import { Files } from "../Files.js";

export class Hole {
  static get parameters() {
    return [new Inject(Config), new Inject(Files)];
  }
  constructor(config, files) {
    this.files = files;
    this.config = config;
  }
  splitHoles(filename) {
    var { files, config } = this;
    var content = fs.readFileSync(filename) + "";
    var lines = content
      .replace(/(?:\\[rn]|[\r\n]+)+/g, String.fromCharCode(0))
      .split(String.fromCharCode(0));
    var i = 0;
    var headers = [],
      holes = [],
      inits = [],
      footers = [];
    while (i < lines.length) {
      if (lines[i].match(/^(T|;Holesize)/i)) {
        break;
      }
      headers.push(lines[i]);
      i++;
    }
    while (i < lines.length) {
      if (!lines[i].match(/^[T;]/i)) {
        break;
      }
      holes.push(lines[i]);
      i++;
    }
    while (i < lines.length) {
      if (lines[i].match(/^T/i)) {
        break;
      }
      inits.push(lines[i]);
      i++;
    }
    var holeList = holes
      .filter((o) => o.match(/^T/i))
      .map((o) => {
        var hole = o.replace(/[TC]/gi, " ").trim().split(/\s+/);
        return { id: hole[0], size: hole[1] };
      });
    var segs = [];
    holeList.map((o) => {
      var tool = {
        id: o,
        data: [lines[i++]],
      };
      segs.push(tool);
      while (i < lines.length) {
        if (lines[i].match(/^[T|M]/i)) {
          break;
        }
        tool.data.push(lines[i]);
        i++;
      }
    });
    footers.push(lines[i++]);
    while (i < lines.length) {
      footers.push(lines[i++]);
    }
    function generateDrillFile(toolList, fileName) {
      var holeTxt = toolList.map((o, i) => {
        return `T${i + 1 < 10 ? "0" : ""}${i + 1}C${o.id.size}`;
      });
      var codes = toolList
        .map((o, i) => {
          return o.data
            .map((p, j) => {
              if (j == 0) return `T${i + 1 < 10 ? "0" : ""}${i + 1}`;
              return p;
            })
            .join("\n");
        })
        .join("\n");
      var content = `${headers.join("\n")}
${holeTxt.join("\n")}
${inits.join("\n")}
${codes}
${footers.join("\n")}
      `;
    }
    var ss = segs.reduce((a, b) => {
      if (b.id.size < 1) {
        a.first = a.first || [];
        a.first.push(b);
      } else {
        a.second = a.second || [];
        a.second.push(b);
      }
      return a;
    }, {});
    var drill = files.get("_PTH");
    var scripts = [
      `open_excellon ${drill} -outname drill
mirror drill -axis Y -box cutout`,
    ];
    //   console.log(ss);
    if (ss.first) {
      // generateDrillFile(ss.first, `${fname}`);
      scripts.push(`# drill holes

drillcncjob drill -tools ${ss.first
        .map((o, i) => parseInt(o.id.id))
        .join()} -drillz ${config.drillDepth} -travelz 2 -feedrate ${
        config.drillFeedRate
      } -spindlespeed ${config.spindleSpeed} -outname drill_cnc
write_gcode drill_cnc ${files.dir}/drill.cnc

      `);
    }
    if (ss.second) {
      // generateDrillFile(ss.second, fname);
      scripts.push(`# milling holes
millholes drill -tools ${ss.second
        .map((o, i) => parseInt(o.id.id))
        .join()} -tooldia ${config.drillToolDiameter} -outname drill_mill_geo
cncjob drill_mill_geo -z_cut -2 -z_move 2 -feedrate 50 -tooldia ${
        config.drillToolDiameter
      } -spindlespeed ${
        config.spindleSpeed
      } -multidepth true -depthperpass 0.5 -outname drill_mill_cnc      
write_gcode drill_mill_cnc ${files.dir}/drill_mill.cnc

      `);
    }

    // console.log(scripts);
    return scripts.join("\n");
    //   var less1mm = segs.filter((o) => o.id.size < 1);
    //   var others = segs.filter((o) => less1mm.indexOf(o) == -1);
    // generate new drill file

    // read tool list
    //   console.log(all);
  }
}
