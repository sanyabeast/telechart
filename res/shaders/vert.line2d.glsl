precision mediump float;

attribute vec2 coords;
attribute vec2 normal;

uniform vec2  position;
uniform float thickness;
uniform float opacity;

uniform float resolution;
uniform vec2  worldPosition;
uniform vec2  worldScale;
uniform vec2  viewportSize;

vec2 scaleNormal ( vec2 normal, vec2 scale ) {
   normal /= vec2( scale.y, scale.x );    
   float hypo = length( normal );
   return( vec2( ( normal.x / hypo ), ( normal.y / hypo ) ) );
}


vec2 translate( vec2 pos ) {
   pos -= position;
   pos -= worldPosition;
   return( pos );
}

vec2 project( vec2 pos ) {
   return( pos / worldScale );
}


vec2 projectToScreen( vec2 pos ) {
   pos /= viewportSize;
   pos -= 1.;
   return( pos );
}


void main(void) {
   	vec2 pos = translate( coords );
      vec2 n = scaleNormal( normal, worldScale );

   	pos = project( pos );

   	pos += ( n * ( thickness * resolution ) );

   	pos = projectToScreen( pos );

   	gl_Position = vec4( pos.xy, 0., 1. );

}