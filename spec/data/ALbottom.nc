(This GCode script was designed to adjust the Z height of a CNC machine according)
(to the minute variations in the surface height in order to achieve a better result in the milling/etching process)
(This script is the output of AutoLevellerAE, 0.9.5u2 Changeset: ...2d0387 @ http://autoleveller.co.uk)
(Author: James Hawthorne PhD. File creation date: 29-06-2021 15:43)
(This program and any of its output is licensed under GPLv2 and as such...)
(AutoLevellerAE comes with ABSOLUTELY NO WARRANTY; for details, see sections 11 and 12 of the GPLv2 @ http://www.gnu.org/licenses/old-licenses/gpl-2.0.html)

G90 G20 S20000 G17

M0 (Attach probe wires and clips that need attaching)
(Initialize probe routine)
G0 Z1.5 (Move clear of the board first)
G1 X0 Y0 F35 (Move to bottom left corner)
G0 Z0.0787 (Quick move to probe clearance height)
G31 Z-0.0625 F5 (Probe to a maximum of the specified probe height at the specified feed rate)
G92 Z0 (Touch off Z to 0 once contact is made)
G0 Z0.0787 (Move Z to above the contact point)
G31 Z-0.0625 F2.5 (Repeat at a more accurate slower rate)
G92 Z0
G0 Z0.0787
M0 (Detach any clips used for probing)


G21
G90
G94
F100.00
G00 Z5.0000
M03 S12000
G4 P1
G00 X0.5Y0.2
G01 Z0.39000
G01 X3.5Y3.3Z-0.04500
G01 X0.5Y3Z-0.15000

G00 Z5.0000

G0 X1.5Y1.5
G01 Z-0.02500
G01 X3.5Y2.3Z-0.13501
G0 Z5
G00 X0Y0
M05
