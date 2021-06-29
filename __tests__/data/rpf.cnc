M0 (Attach probe wires and clips that need attaching)
(Initialize probe routine)
G92 X0 Y0 Z0
G0 Z5 (Move clear of the board first)
G1 X0.5 Y0.2 F800 (Move to bottom left corner)
G0 Z2 (Quick move to probe clearance height)
G31 Z-1 F50 (Probe to a maximum of the specified probe height at the specified feed rate)
G92 Z0 (Touch off Z to 0 once contact is made)
G0 Z2 (Move Z to above the contact point)
G31 Z-1 F25 (Repeat at a more accurate slower rate)
G92 Z0
G0 Z2


M40 (Begins a probe log file, when the window appears, enter a name for the log file such as "RawProbeLog.txt")
G0 Z2
G1 X0.5 Y0.2 F800
G31 Z-1 F50
G0 Z2
G1 X2 Y1.7499999999999998 F800
G31 Z-1 F50
G0 Z2
G1 X3.5 Y0.2 F800
G31 Z-1 F50
G0 Z2
G1 X3.5 Y3.3 F800
G31 Z-1 F50
G0 Z2
G1 X0.5 Y3.3 F800
G31 Z-1 F50
G0 Z5


M41 (Closes the opened log file)
G0 X0 Y0 Z5
M0 (Detach any clips used for probing)
M30
