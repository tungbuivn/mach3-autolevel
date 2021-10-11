# Aid milling pcb with autolevelling bed

## What is does ?

Generate gcode for milling pcb by automation script for flatcam and recalculate entire heigh of the gcode file

## Installing

npm install -g mach3-pcb-autoleveller

## Requirement
+ gerber file which exported from easyeda
+ flatcam version 8.5
+ only support milling bottom layer of the pcb by mirror content of pcb throungt y axis, milling the top layer done by manual
+ a knife milling pcb 0.1mm, 60deg, a milling knife flat 0.6mm, a milling knife flat 1.5mm
+ you are a programer or atleat you know how to install nodejs and using commandline :D

## How to use ?

* Open commandline and change working folder contains gerber file
* run command "ger" to start flatcam and generate G-CODE script
* run command "rpf cutout.nc" to generate heighmap file to probe
* open file rpf.nc in the mach3 and run it, and then named file to save height probed as mapfile
* copy content of drill_mill.nc and paste to end of file drill.nc
* return to console and run following commands:
** rpfmap bottom_layer.nc mapfile
** rpfmap cutout.nc mapfile
** rpfmap drill.nc mapfile
after that you will have 3 file: almod-bottom_layer.nc contain bottom layer of pcb, almod-drill.nc contains drilling hole of pcb and almod-cutout.nc will cutout pcb. Every height of every point in the g-code will be recalculating by adding distance from height-map file to the XY plane.

Note: remember to replace knife to 0.6mm before running file drill.nc

References:
  calculating milling speed & vbit knife: https://www.precisebits.com/calc
  autolevelerae: http://www.autoleveller.co.uk/

