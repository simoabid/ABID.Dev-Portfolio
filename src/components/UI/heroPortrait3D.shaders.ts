/**
 * GLSL shaders for HeroPortrait3D.
 *
 * The fragment shader blends two portrait textures using:
 *  - a cursor-driven soft circular reveal whose edge is perturbed by
 *    multi-octave value noise (organic, "liquid" boundary)
 *  - a constant ambient noise displacement so the image feels alive at idle
 *  - an accent-tinted rim glow at the reveal boundary
 *
 * Source textures are expected to share the container's aspect ratio
 * (square in our case); the parent <Image>/CSS layer already enforces this.
 */

export const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uTextureA;
  uniform sampler2D uTextureB;
  uniform vec2  uMouse;
  uniform float uHover;
  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec3  uAccent;

  varying vec2 vUv;

  // --- 2D value noise -------------------------------------------------------
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    // Center-relative UVs for symmetric noise / mask math
    vec2 centered = vUv - 0.5;

    // Subtle ambient drift — only activates once the user starts hovering.
    // At idle (uHover == 0) the offset is exactly zero so the image renders clean.
    float ambient = fbm(vUv * 3.0 + uTime * 0.08);
    vec2 ambientOffset = vec2(
      fbm(vUv * 4.0 + uTime * 0.10),
      fbm(vUv * 4.0 - uTime * 0.10)
    ) - 0.5;
    ambientOffset *= 0.006 * uHover;

    // Cursor-driven pull: warps UVs toward the cursor on hover
    vec2 toMouse = uMouse - vUv;
    float dist = length(toMouse);
    float pull = uHover * exp(-dist * 6.0) * 0.04;
    vec2 mouseOffset = toMouse * pull;

    vec2 sampleUv = vUv + ambientOffset + mouseOffset;

    // Organic reveal mask: circular falloff perturbed by fbm
    float n = fbm(vUv * 5.0 + uTime * 0.25);
    float radius = mix(0.0, 0.55, uHover);
    float edge = 0.18 + 0.12 * uHover;
    float mask = 1.0 - smoothstep(
      radius - edge,
      radius + edge,
      dist + (n - 0.5) * 0.18 * uHover
    );
    mask *= uHover; // fully off when not hovered

    // Texture lookups (with displacement)
    vec4 colA = texture2D(uTextureA, sampleUv);
    vec4 colB = texture2D(uTextureB, sampleUv);

    // Subtle chromatic split on the B texture for a "liquid lens" feel
    float ca = 0.004 * uHover;
    vec2 dir = normalize(toMouse + 1e-5);
    float br = texture2D(uTextureB, sampleUv + dir * ca).r;
    float bb = texture2D(uTextureB, sampleUv - dir * ca).b;
    colB.rgb = vec3(br, colB.g, bb);

    // Blend A -> B using the organic mask
    vec3 col = mix(colA.rgb, colB.rgb, mask);

    // Accent rim glow along the reveal boundary
    float rim = smoothstep(0.0, 0.25, mask) * (1.0 - smoothstep(0.25, 0.55, mask));
    col += uAccent * rim * 0.35 * uHover;

    // Soft vignette so the canvas blends with the rounded container
    float vig = smoothstep(0.72, 0.48, length(centered));

    // Tiny grain — only add during hover so the idle image stays clean.
    float grain = (hash(vUv * uResolution + uTime) - 0.5) * 0.02;
    col += grain * uHover;

    gl_FragColor = vec4(col, max(colA.a, colB.a) * vig);
  }
`;
