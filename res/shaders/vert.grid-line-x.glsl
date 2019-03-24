precision ${maxShaderPrecision} float;

attribute vec2 coords;

uniform vec2  position;

uniform vec2  worldPosition;
uniform vec2  worldScale;
uniform vec2  viewportSize;

uniform vec2  selectedPosition;

void main(void) {
    vec2 pos = vec2( coords );

    float offsetX = ( selectedPosition.x - worldPosition.x ) / worldScale.x;

    pos.x += offsetX;
   
   	pos.x /= viewportSize.x;
    pos.y *= 2.;
    pos -= 1.;

  	gl_Position = vec4( pos.xy, 0., 1.);
}