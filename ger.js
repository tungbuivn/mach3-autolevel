#!/usr/bin/env node
// define constant
const zSafe = 5;

const drillToolDiameter = 0.6;
const drillFeedRate = 50;
const drillDepth = -1.8;

const bottomLayerFeedRate = 100;
const bottomLayerToolDiameter = 0.2;

const cutoutDepth = -2;
const cutoutDepthPerpass = 0.5;
const cutoutFeedRate = 600;
const cutoutToolDiameter = 1.5;

const spindleSpeed = 12000;

var fs = require("fs");
var path = require("path");
var spawn = require("child_process").spawn;
var dir = process.cwd().replace(/\\/g, "/");
var fileList = fs.readdirSync(dir).filter((e) => {
  return e.match(/(_PTH\.DRL|BoardOutline\.GKO|BottomLayer\.GBL)$/gi);
});
function get(name) {
  var re = new RegExp(name, "gi");
  var fn = fileList.filter((e) => e.match(re))[0];
  return path.join(dir, fn).replace(/\\/g, "/");
}

function applyTpl() {
  var boardOutline = get("BoardOutline");
  var bottomLayer = get("BottomLayer");
  var drill = get("_PTH");
  return `
set_sys "units" "MM"
new
open_gerber ${boardOutline} -outname cutout
open_gerber ${bottomLayer} -outname bottom_layer
mirror bottom_layer -axis Y -box cutout
isolate bottom_layer -dia ${bottomLayerToolDiameter} -overlap ${
    bottomLayerToolDiameter / 3
  } -passes 2 -combine 1 -outname bottom_layer_iso
cncjob bottom_layer_iso -z_cut -0.1 -z_move ${zSafe} -feedrate ${bottomLayerFeedRate} -tooldia ${bottomLayerToolDiameter} -spindlespeed ${spindleSpeed} -multidepth false -depthperpass 0.1 -outname bottom_layer_cnc
write_gcode bottom_layer_cnc ${dir}/bottom_layer.cnc
#> [-box <nameOfBox> | -dist <number>]


# drill holes
open_excellon ${drill} -outname drill
mirror drill -axis Y -box cutout
drillcncjob drill -drillz ${drillDepth} -travelz 2 -feedrate ${drillFeedRate} -spindlespeed ${spindleSpeed} -outname drill_cnc
write_gcode drill_cnc ${dir}/drill.cnc
#[-tools <str>] [-drillz <float>] [-travelz <float>] [-feedrate <float>] [-spindlespeed <int>] [-toolchange <bool>] [-outname <str>]


#cut board

isolate cutout -dia ${cutoutToolDiameter} -overlap 0.1 -combine 0 -outname cutout_iso
#delete cutout_iso2
exteriors cutout_iso -outname cutout_iso_exterior
delete cutout_iso
geocutout cutout_iso_exterior -dia ${cutoutToolDiameter} -gapsize 0.15 -gaps 4 
cncjob cutout_iso_exterior -z_cut ${cutoutDepth} -z_move ${zSafe} -feedrate ${cutoutFeedRate} -tooldia ${cutoutToolDiameter} -spindlespeed ${spindleSpeed} -multidepth true -depthperpass ${cutoutDepthPerpass} -outname cutout_cnc
#cncjob <str> [-z_cut <float>] [-z_move <float>] [-feedrate <float>] [-tooldia <float>] [-spindlespeed <int>] [-multidepth <bool>] [-depthperpass <float>] [-outname <str>]
write_gcode cutout_cnc ${dir}/cutout.cnc

#merge all geometry to autoleveller
#join_geometries all bottom_layer_iso drill cutout_iso_exterior 
#cncjob all -z_cut ${cutoutDepth} -z_move ${zSafe} -feedrate ${cutoutFeedRate} -tooldia ${cutoutToolDiameter} -spindlespeed ${spindleSpeed} -multidepth true -depthperpass ${cutoutDepthPerpass} -outname all_cnc
#write_gcode all_cnc ${dir}/all.cnc
`;
}
var outScript = `${dir}/script.txt`;
fs.writeFileSync(outScript, applyTpl());
spawn(`C:/Program Files (x86)/FlatCAM/FlatCAM.exe`, [
  `--shellfile=${outScript}`,
]);
