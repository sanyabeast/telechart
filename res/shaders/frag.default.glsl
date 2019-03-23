precision ${maxShaderPrecision} float;

uniform vec3 diffuse;
uniform float opacity;

void main( void ) {
   gl_FragColor = vec4( diffuse, opacity );
}