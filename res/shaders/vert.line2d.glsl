precision highp float;

attribute vec2 coords;
attribute vec2 normal;

uniform vec2  position;
uniform float thickness;
uniform vec2  worldPosition;
uniform vec2  worldScale;
uniform vec2  viewportSize;

vec2 scaleNormal ( vec2 normal, vec2 scale ) {
   normal /= scale;    

   float hypo = sqrt( pow( normal.x, 2. ) + pow( normal.y, 2. ) );
   float nsin = normal.y / hypo;
   float ncos = normal.x / hypo;

   normal.x = nsin;
   normal.y = ncos;                                                             

   return(normal);
}

void main(void) {
   	vec2 pos = vec2( coords );

   	pos -= position;
   	pos -= worldPosition;
   	pos /= worldScale;

      vec2 n = scaleNormal( normal, worldScale );

   	pos += ( n * ( thickness ) );

   	pos /= viewportSize;

   	gl_Position = vec4( pos.x, pos.y, 0., 1. );

}