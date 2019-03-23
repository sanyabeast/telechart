precision highp float;

attribute vec2 coords;
uniform vec2 position;

uniform vec2  worldPosition;
uniform vec2  worldScale;
uniform vec2  viewportSize;

varying vec2 vUv;

void main(void) {
    vUv = coords;

    vec2 pos = vec2( coords );

    pos *= 2.;
    pos -= 1.;

    gl_Position = vec4( pos.xy, 0., 1.);
}