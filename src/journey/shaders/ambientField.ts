// src/journey/shaders/ambientField.ts
// Continuous procedural gold caustic and atmospheric shader running across the full journey

import * as THREE from 'three';

export const ambientFieldVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const ambientFieldFragmentShader = `
  uniform float uProgress;
  uniform float uTime;
  uniform vec3 uGoldColor;
  uniform vec3 uDarkColor;
  uniform vec2 uMouse;
  varying vec2 vUv;
  varying vec3 vPosition;

  // Simplex-inspired 2D noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.08;

    // Multi-octave wave coordinates
    float n1 = snoise(uv * 3.5 + vec2(t * 0.5, t * 0.3));
    float n2 = snoise(uv * 7.0 - vec2(t * 0.3, t * 0.6) + n1 * 0.4);
    float n3 = snoise(uv * 12.0 + vec2(t * 0.2, t * 0.4) + n2 * 0.2);

    float combined = (n1 * 0.5 + n2 * 0.35 + n3 * 0.15) * 0.5 + 0.5;

    // Subtle drift in illumination based on progress
    float progressShift = sin(uProgress * 3.14159265);
    float goldIntensity = pow(combined, 2.2) * (0.35 + progressShift * 0.15);

    // Radial vignette falloff from center
    float dist = length(uv - vec2(0.5));
    float vignette = smoothstep(0.8, 0.2, dist);

    vec3 color = mix(uDarkColor, uGoldColor, goldIntensity * vignette);
    
    // Add subtle ambient gold rim glint
    color += uGoldColor * pow(combined, 4.0) * 0.12;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function createAmbientFieldMaterial() {
  return new THREE.ShaderMaterial({
    vertexShader: ambientFieldVertexShader,
    fragmentShader: ambientFieldFragmentShader,
    uniforms: {
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uGoldColor: { value: new THREE.Color('#c9a24b') },
      uDarkColor: { value: new THREE.Color('#0c0a08') },
      uMouse: { value: new THREE.Vector2(0, 0) },
    },
    depthWrite: false,
    depthTest: false,
  });
}
