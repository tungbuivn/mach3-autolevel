import * as fs from "fs";
import * as path from "path";
import { spawn } from "child_process";
import { Config } from "../config2.js";
import { Files } from "../Files.js";
import { Hole } from "./hole.js";
import { Inject } from "injection-js";

export class Gerber {
  static get parameters() {
    return [new Inject(Config), new Inject(Files), new Inject(Hole)];
  }

  /**
   *
   * @param {Config} config
   */
  constructor(config, files, hole) {
    Object.assign(this, { config, files, hole });
  }
  run() {
    var { config, hole, files } = this;
    // define constant
    var {
      zSafe,
      drillToolDiameter,
      drillFeedRate,
      drillDepth,
      bottomLayerFeedRate,
      bottomLayerMillingDepth,
      bottomLayerMillingCount,
      bottomLayerToolDiameter,
      cutoutDepth,
      cutoutDepthPerpass,
      cutoutFeedRate,
      cutoutToolDiameter,
      spindleSpeed,
    } = config;
    // const zSafe = 5;

    // const drillToolDiameter = 0.6;
    // const drillFeedRate = 50;
    // const drillDepth = -1.8;

    // const bottomLayerFeedRate = 100;
    // const bottomLayerToolDiameter = 0.2;

    // const cutoutDepth = -2;
    // const cutoutDepthPerpass = 0.5;
    // const cutoutFeedRate = 600;
    // const cutoutToolDiameter = 1.5;

    // const spindleSpeed = 12000;

    var dir = files.dir;
    var fileList = files.files;
    var holeList = fileList
      .filter((o) => o.match(/_PTH\.DRL/i))
      .map((f) => {
        var ct = fs.readFileSync(f) + "";
        return ct
          .replace(/(?:\\[rn]|[\r\n]+)+/g, String.fromCharCode(0))
          .split(String.fromCharCode(0))
          .filter((s) => s.match(/^;Holesize/i))
          .map((o) => {
            var it = o.split("=");
            var id = it[0].match(/\d+/)[0];
            var size = it[1].trim().split(/\s+/);
            return {
              id,
              size: parseFloat(size[0]),
            };
          });
      });
    var drillList = holeList.filter((o) => o.size < 1.0);
    var millingList = holeList.filter((o) => drillList.indexOf(0) == -1);
    // container.hole.splitHoles(fileList.filter((o) => o.match(/_PTH\.DRL/i))[0]);
    // require("./hole")(fileList.filter((o) => o.match(/_PTH\.DRL/i))[0]);
    // process.exit(-1);
    function get(name) {
      // console.log("geting name", fileList, dir, name);
      var re = new RegExp(name, "gi");
      var fn = fileList.filter((e) => e.match(re));
      if (fn.length == 0) {
        throw new Error("Khong tim thay file !!!", name);
      }
      return path.join(dir, fn[0]).replace(/\\/g, "/");
    }

    function applyTpl(pos) {
      var boardOutline = get("BoardOutline");
      var bottomLayer = get("BottomLayer");
      var topLayer = get("TopLayer");
      // var drill = get("_PTH");
      return [
        `
set_sys "units" "MM"
new
open_gerber ${boardOutline} -outname cutout
open_gerber ${bottomLayer} -outname bottom_layer
mirror bottom_layer -axis Y -box cutout
isolate bottom_layer -dia ${bottomLayerToolDiameter} -overlap ${
          bottomLayerToolDiameter / 3
        } -passes ${bottomLayerMillingCount} -combine 1 -outname bottom_layer_iso
cncjob bottom_layer_iso -z_cut -0.1 -z_move ${zSafe} -feedrate ${bottomLayerFeedRate} -tooldia ${bottomLayerToolDiameter} -spindlespeed ${spindleSpeed} -multidepth false -depthperpass 0.1 -outname bottom_layer_cnc
write_gcode bottom_layer_cnc ${dir}/bottom_layer.nc
#> [-box <nameOfBox> | -dist <number>]

${hole.splitHoles(fileList.filter((o) => o.match(/\.DRL/i))[0])}

#cut board

isolate cutout -dia ${cutoutToolDiameter} -overlap 0.1 -combine 0 -outname cutout_iso
exteriors cutout_iso -outname cutout_iso_exterior
delete cutout_iso
geocutout cutout_iso_exterior -dia ${cutoutToolDiameter} -gapsize 0.15 -gaps 4 
cncjob cutout_iso_exterior -z_cut ${cutoutDepth} -z_move ${zSafe} -feedrate ${cutoutFeedRate} -tooldia ${cutoutToolDiameter} -spindlespeed ${spindleSpeed} -multidepth true -depthperpass ${cutoutDepthPerpass} -outname cutout_cnc
#cncjob <str> [-z_cut <float>] [-z_move <float>] [-feedrate <float>] [-tooldia <float>] [-spindlespeed <int>] [-multidepth <bool>] [-depthperpass <float>] [-outname <str>]
write_gcode cutout_cnc ${dir}/cutout.nc

#merge all geometry to autoleveller
#join_geometries all bottom_layer_iso drill cutout_iso_exterior 
#cncjob all -z_cut ${cutoutDepth} -z_move ${zSafe} -feedrate ${cutoutFeedRate} -tooldia ${cutoutToolDiameter} -spindlespeed ${spindleSpeed} -multidepth true -depthperpass ${cutoutDepthPerpass} -outname all_cnc
#write_gcode all_cnc ${dir}/all.nc
`,
        `

#process top layer
set_sys "units" "MM"
new
open_gerber ${boardOutline} -outname cutout-top
open_gerber ${topLayer} -outname top_layer
isolate top_layer -dia ${bottomLayerToolDiameter} -overlap ${
          bottomLayerToolDiameter / 3
        } -passes ${bottomLayerMillingCount} -combine 1 -outname top_layer_iso
cncjob top_layer_iso -z_cut -0.1 -z_move ${zSafe} -feedrate ${bottomLayerFeedRate} -tooldia ${bottomLayerToolDiameter} -spindlespeed ${spindleSpeed} -multidepth false -depthperpass 0.1 -outname top_layer_cnc
write_gcode top_layer_cnc ${dir}/top_layer.nc     

${hole.splitHoles(fileList.filter((o) => o.match(/\.DRL/i))[0], true)} 


#cut board

isolate cutout-top -dia ${cutoutToolDiameter} -overlap 0.1 -combine 0 -outname cutout_top_iso
exteriors cutout_top_iso -outname cutout_top_iso_exterior
delete cutout_top_iso
geocutout cutout_top_iso_exterior -dia ${cutoutToolDiameter} -gapsize 0.15 -gaps 4 
cncjob cutout_top_iso_exterior -z_cut ${cutoutDepth} -z_move ${zSafe} -feedrate ${cutoutFeedRate} -tooldia ${cutoutToolDiameter} -spindlespeed ${spindleSpeed} -multidepth true -depthperpass ${cutoutDepthPerpass} -outname cutouttop_cnc
#cncjob <str> [-z_cut <float>] [-z_move <float>] [-feedrate <float>] [-tooldia <float>] [-spindlespeed <int>] [-multidepth <bool>] [-depthperpass <float>] [-outname <str>]
write_gcode cutouttop_cnc ${dir}/cutout_top.nc
`,
      ][pos];
    }
    var outScript = `${dir}/script.txt`;
    fs.writeFileSync(outScript, applyTpl(0));
    spawn(`C:/Program Files (x86)/FlatCAM/FlatCAM.exe`, [
      `--shellfile=${outScript}`,
    ]);

    outScript = `${dir}/script_top.txt`;
    fs.writeFileSync(outScript, applyTpl(1));
    spawn(`C:/Program Files (x86)/FlatCAM/FlatCAM.exe`, [
      `--shellfile=${outScript}`,
    ]);
    // spawn('../genrpf.js',['./cutout.nc'])
  }
}
// /**
//  *
//  * @param {import("docs").IContainer} container
//  * @returns
//  */
// module.exports = function (container) {
//   return () => {};
// };
