(This GCode script was designed to adjust the Z height of a CNC machine according)
(to the minute variations in the surface height in order to achieve a better result in the milling/etching process)
(This script is the output of AutoLevellerAE, 0.9.5u2 Changeset: ...2d0387 @ http://autoleveller.co.uk)
(Author: James Hawthorne PhD. File creation date: 26-06-2021 10:06)
(This program and any of its output is licensed under GPLv2 and as such...)
(AutoLevellerAE comes with ABSOLUTELY NO WARRANTY; for details, see sections 11 and 12 of the GPLv2 @ http://www.gnu.org/licenses/old-licenses/gpl-2.0.html)

G90 G21 S20000 G17

M0 (Attach probe wires and clips that need attaching)
(Initialize probe routine)
G1 X0 Y0 F1000 (Move to bottom left corner)
G31 Z-100 F50 (Probe to a maximum of the specified probe height at the specified feed rate)
G92 Z0 (Touch off Z to 0 once contact is made)
G0 Z5
M0 (Detach any clips used for probing)
    
G21
G90
G94
F100.00
G00 Z5.0000
M03 S12000
G4 P1
G00 X0.5 Y0.2
G01 Z0.0000
G01 Z0.0000
G01 X0.6475 Y0.3525 Z0.0295          ;auto splited
G01 X1.0000 Y0.7167 Z0.1000          ;auto splited
G01 X1.1393 Y0.8607 Z0.0861          ;auto splited
G01 X1.2742 Y1.0000 Z0.0726          ;auto splited
G01 X2.0000 Y1.7500 Z0.0000          ;auto splited
G01 X2.1230 Y1.8770 Z-0.0246          ;auto splited
G01 X2.2419 Y2.0000 Z-0.0484          ;auto splited
G01 X2.6148 Y2.3852 Z-0.1230          ;auto splited
G01 X3.0000 Y2.7833 Z-0.2000          ;auto splited
G01 X3.1066 Y2.8934 Z-0.2320          ;auto splited
G01 X3.2097 Y3.0000 Z-0.3048          ;auto splited
G01 X3.5 Y3.3 Z-0.4500
G01 X3.0000 Y3.2500 Z-0.2000          ;auto splited
G01 X2.7727 Y3.2273 Z-0.1545          ;auto splited
G01 X2.0000 Y3.1500 Z0.0000          ;auto splited
G01 X1.8636 Y3.1364 Z0.0136          ;auto splited
G01 X1.0000 Y3.0500 Z0.1000          ;auto splited
G01 X0.5 Y3 Z0.0000
G00 Z5.0000
G0 X1.5 Y1.5
G01 Z0.0500
G01 Z0.0500
G01 X2.0000 Y1.7000 Z0.0000          ;auto splited
G01 X2.2143 Y1.7857 Z-0.0429          ;auto splited
G01 X2.7500 Y2.0000 Z-0.1500          ;auto splited
G01 X2.9286 Y2.0714 Z-0.1857          ;auto splited
G01 X3.0000 Y2.1000 Z-0.2000          ;auto splited
G01 X3.5 Y2.3 Z-0.3500
G0 Z5
G00 X0 Y0
G0 X0 Y1
G0 Z-0.1000
G01 X1 Y1 Z0.1000
G01 X1 Y1 Z0.1000
G01 X1 Y0 Z0.1000
G01 X2 Y0 Z0.0000
G01 X2 Y1 Z0.0000
G01 X3 Y1 Z-0.2000
G00 X0 Y0 Z-0.1000
G0 z5
G0 Z-0.1000
G01 X0 Y0 Z-0.1000
G01 X0 Y0 Z-0.1000
G01 X1 Z0.1000
G02 X1.2192235935955849 Y0.7807764064044151 Z0.0781 I1.5              ;auto split arc
G02 X1.381966011250105 Y1 Z0.0618 I1.2807764064044151 J-0.7807764064044151              ;auto split arc
G02 X2 Y1.4142135623730951 Z0.0000 I1.118033988749895 J-1              ;auto split arc
G02 X2.5 Y1.5 Z-0.1000 I0.5 J-1.4142135623730951              ;auto split arc
G03 X3 Y1.6339745962155614 Z-0.2000 J1              ;auto split arc
G03 X3.3660254037844384 Y2 Z-0.3098 I-0.5 J0.8660254037844386              ;auto split arc
G03 X3.5 Y2.5 Z-0.3500 I-0.8660254037844384 J0.5              ;auto split arc
G03 X3.3660254037844384 Y3 Z-0.3830 I-1 J0              ;auto split arc
G03 X3 Y3.3660254037844384 Z-0.2000 I-0.8660254037844384 J-0.5              ;auto split arc
G03 X2.5 Y3.5 Z-0.1000 I-0.5 J-0.8660254037844384              ;auto split arc
G03 X2.5 Y5 Z-0.3000 I0 J-1              ;auto split arc
M05