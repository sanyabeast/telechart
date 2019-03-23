precision highp float;

attribute vec2 coords;
uniform vec2 position;

uniform vec2  worldPosition;
uniform vec2  worldScale;
uniform vec2  viewportSize;

vec2 translate ( vec2 pos ) {
	pos += position;
	pos -= worldPosition;
	return( pos );
}

vec2 project ( vec2 pos ) {
	pos /= worldScale;
	pos /= viewportSize;
	return( pos );
}

void set ( vec2 pos ) {
	gl_Position = vec4(pos.xy , 0., 1.0);
}

void main(void) {
   vec2 pos = vec2( coords );
   pos = translate( pos );
   pos = project( pos );
   set( pos );
}