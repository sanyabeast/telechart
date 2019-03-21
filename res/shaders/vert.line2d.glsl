precision highp float;

attribute vec2 coords;
attribute vec2 normal;

uniform vec2 position;
uniform float thickness;
uniform vec2 worldPosition;
uniform vec2 worldScale;
uniform vec2 viewportSize;

vec2 toReal ( vec2 pos ) {
	pos += position;
	pos -= worldPosition;
	pos *= viewportSize;
	pos *= worldScale;
	return( pos );
}

void main(void) {
   vec2 pos = vec2( coords );

   pos = toReal( pos );

   pos = pos + ( normal * thickness );

   gl_Position = vec4(pos.xy, 0., 1.0);
}