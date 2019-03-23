precision highp float;

uniform vec3 diffuse;

uniform float resolution;
uniform vec2 worldPosition;
uniform vec2 worldScale;
uniform vec2 viewportSize;

uniform vec2 gridSteps;

varying vec2 vUv;

void main( void ) {
	vec2 fragCoord = ( ( vUv * viewportSize ) + ( worldPosition / worldScale / 2. ) );
	vec2 steps = ( gridSteps / worldScale );

	if ( int( mod( fragCoord.y, steps.y ) ) == 0 ) {
		gl_FragColor = vec4(diffuse, 1.);
	} else {
		gl_FragColor = vec4(vec3(0., 0., 0.), 0.);
	}

    
}