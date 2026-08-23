// src/journey/cameraPath.ts
// 3D Camera waypoints and lookAt trajectory along a CatmullRom spline through the continuous world

import { CatmullRomCurve3, Vector3 } from 'three';

// 7 waypoints corresponding to the 7 journey acts
export const CAMERA_WAYPOINTS: Vector3[] = [
  new Vector3(0, 1.6, 6.0),     // Act I: Arrival (Centered facing proscenium arch)
  new Vector3(2.2, 1.8, 2.0),   // Act II: Story (Slight right offset, orbiting milestone helix)
  new Vector3(0, 2.2, -2.0),    // Act III: Offerings (Elevated overview of discipline emblems)
  new Vector3(-3.2, 1.5, -6.0), // Act IV: Proof (Left gallery angle viewing project depth plane)
  new Vector3(-1.0, 1.1, -10.0),// Act V: Moments (Close ambient view through capture particles)
  new Vector3(1.8, 1.3, -14.0), // Act VI: What's Next (Dynamic forward angle for countdown galas)
  new Vector3(0, 1.6, -18.0),   // Act VII: Begin (Centered serene horizon for final inquiry)
];

// Target lookAt waypoints (slightly below eye level to frame HTML overlays and focal centers)
export const LOOKAT_WAYPOINTS: Vector3[] = [
  new Vector3(0, 1.3, 0.0),      // Act I LookAt
  new Vector3(0.5, 1.5, -4.0),   // Act II LookAt
  new Vector3(0, 1.9, -8.0),     // Act III LookAt
  new Vector3(-1.0, 1.2, -12.0), // Act IV LookAt
  new Vector3(0, 0.8, -16.0),    // Act V LookAt
  new Vector3(0.5, 1.0, -20.0),  // Act VI LookAt
  new Vector3(0, 1.3, -24.0),    // Act VII LookAt
];

// Continuous smooth centripetal spline curves
export const cameraCurve = new CatmullRomCurve3(CAMERA_WAYPOINTS, false, 'catmullrom', 0.25);
export const lookAtCurve = new CatmullRomCurve3(LOOKAT_WAYPOINTS, false, 'catmullrom', 0.25);
