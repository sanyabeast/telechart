precision mediump float;

uniform vec3 diffuse;

void main(void) {
   gl_FragColor = vec4(diffuse, 1);
}