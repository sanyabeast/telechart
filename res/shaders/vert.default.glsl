precision highp float;

attribute vec2 coords;

uniform vec2 u_offset;
uniform vec2 position;

void main(void) {
   vec2 pos = vec2( coords );
   pos += position;

   gl_Position = vec4(pos.x + u_offset.x, pos.y, 0., 1.0);
}