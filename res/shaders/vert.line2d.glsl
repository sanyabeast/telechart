precision highp float;

attribute vec2 coords;
attribute vec2 normal;

uniform vec2  position;
uniform float thickness;
uniform vec2  worldPosition;
uniform vec2  worldScale;
uniform vec2  viewportSize;

vec2 translate ( vec2 pos ) {
	pos -= position;
	return( pos );
}

vec2 project ( vec2 pos ) {
	pos -= worldPosition;
	pos /= worldScale;
	return( pos );
}

vec2 projectToScreen ( vec2 pos ) {
	pos -= viewportSize;
	pos /= (viewportSize);
	return( pos );
}

void set ( vec2 pos ) {
	gl_Position = vec4(pos.xy , 0., 1.0);
}

void main(void) {
   vec2 pos = vec2( coords );

   
   pos = translate( pos );
   pos = project( pos );
   pos = pos + ( normal * thickness / 2. );

   pos = projectToScreen( pos );

   set( pos );
}