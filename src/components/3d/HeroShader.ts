import * as THREE from 'three';

export const HeroBackgroundMaterialShader = {
  uniforms: {
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uGoldColor: { value: new THREE.Color('#c9a24b') },
    uDarkColor: { value: new THREE.Color('#0c0a08') },
    uAmbientGlow: { value: new THREE.Color('#382810') },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec3 uGoldColor;
    uniform vec3 uDarkColor;
    uniform vec3 uAmbientGlow;
    uniform vec2 uMouse;
    varying vec2 vUv;

    // Simplex noise implementation
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                          0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                         -0.577350269189626,  // -1.0 + 2.0 * C.x
                          0.024390243902439); // 1.0 / 41.0
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
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
      
      // Slow undulating time
      float t = uTime * 0.15;
      
      // Mouse interaction influence
      vec2 mDist = uv - uMouse;
      float mInfluence = smoothstep(0.6, 0.0, length(mDist)) * 0.2;
      
      // Layered noise caustics
      float n1 = snoise(uv * 2.5 + vec2(t * 0.4, -t * 0.3));
      float n2 = snoise(uv * 5.0 - vec2(-t * 0.2, t * 0.5) + vec2(n1 * 0.5));
      float n3 = snoise(uv * 10.0 + vec2(t * 0.1, t * 0.1) + vec2(n2 * 0.3));
      
      float caustics = pow(abs(n1 * 0.5 + n2 * 0.35 + n3 * 0.15 + mInfluence), 2.2);
      
      // Radial vignette from center
      float distFromCenter = length(uv - vec2(0.5, 0.45));
      float vignette = smoothstep(0.9, 0.2, distFromCenter);
      
      // Gradient composition
      vec3 base = mix(uDarkColor, uAmbientGlow, uv.y * 0.5 + 0.1);
      vec3 goldShimmer = mix(base, uGoldColor, caustics * 0.45 * vignette);
      
      // Subtle edge darkening
      vec3 finalColor = mix(uDarkColor, goldShimmer, vignette);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};
