varying vec2 vUv;

uniform float uTime;

void main() {
  vec2 uv = vUv;

  float wave =
    sin(uv.x * 12.0 + uTime * 0.3) *
    cos(uv.y * 10.0 + uTime * 0.25);

  float glow =
    0.5 + wave * 0.5;

  vec3 color =
    mix(
      vec3(0.0, 0.78, 0.65),
      vec3(0.55, 0.96, 1.0),
      glow
    );

  gl_FragColor =
    vec4(color, glow * 0.18);
}
