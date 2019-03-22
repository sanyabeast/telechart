precision highp float;

attribute vec2 coords;
attribute vec2 normal;

uniform vec2  position;
uniform float thickness;
uniform vec2  worldPosition;
uniform vec2  worldScale;
uniform vec2  viewportSize;

void main(void) {
   	vec2 pos = vec2( coords );

   	float normalSin = normal.y / normal.x;
   	float worldScaleSin = worldScale.y / worldScale.x;

   	pos -= position;
   	pos -= worldPosition;
   	pos /= worldScale;

   	vec2 n = normal * worldScale;
   	pos += ( n * ( thickness ) );

   	pos /= viewportSize;

   	gl_Position = vec4( pos.x, pos.y, 0., 1. );

}