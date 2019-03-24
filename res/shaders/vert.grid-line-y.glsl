precision ${maxShaderPrecision} float;

attribute vec2 coords;

uniform vec2  position;

uniform vec2  worldPosition;
uniform vec2  worldScale;
uniform vec2  viewportSize;

uniform float lineIndex;
uniform vec2  gridSteps;

void main(void) {
    vec2 pos = vec2( coords );
    vec2 steps = vec2( gridSteps / worldScale );

    pos.y += steps.y * lineIndex;
    pos.y /= viewportSize.y;
    pos.x *= 2.;
    pos -= 1.;

  	gl_Position = vec4( pos.xy, 0., 1.);
}