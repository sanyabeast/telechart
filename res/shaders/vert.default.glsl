precision highp float;

attribute vec2 coords;
uniform vec2 position;

uniform vec2  worldPosition;
uniform vec2  worldScale;
uniform vec2  viewportSize;

void main(void) {
   GL_Position = vec4( coords.xy, 0., 1.)
}