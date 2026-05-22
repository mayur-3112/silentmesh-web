varying vec2 vUv;

uniform float uTime;

void main() {
  vUv = uv;

  vec3 pos = position;

  pos.z += sin(pos.x * 2.0 + uTime * 0.4) * 0.4;
  pos.z += cos(pos.y * 3.0 + uTime * 0.3) * 0.25;

  gl_Position =
    projectionMatrix *
    modelViewMatrix *
    vec4(pos, 1.0);
}
