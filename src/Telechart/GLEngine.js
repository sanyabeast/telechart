import TelechartModule from "Telechart/Core/TelechartModule"
import ChartMath from "Telechart/ChartMath"
import Utils from "Telechart/Utils"

import Geometry from "Telechart/GLEngine/Core/Geometry"
import Material from "Telechart/GLEngine/Core/Material"
import Mesh from "Telechart/GLEngine/Core/Mesh"
import Uniform from "Telechart/GLEngine/Core/Uniform"
import RenderingObject from "Telechart/GLEngine/Core/RenderingObject"

class GLEngine extends Utils.aggregation( TelechartModule, RenderingObject ) {
	static Geometry = Geometry
	static Material = Material
	static Mesh = Mesh
	static RenderingObject = RenderingObject
	static Uniform = Uniform

	constructor () {
		super()

		this.canvasElement = document.createElement( "canvas" )
		let gl = this.gl = this.canvasElement.getContext( "webgl" )

		document.body.appendChild( this.canvasElement )
 	
		gl.clearColor(0.0, 0.0, 1.0, 1.0);                      
	    gl.enable(gl.DEPTH_TEST);                               
	    gl.depthFunc(gl.LEQUAL);                                
	    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT); 

	    this.render = this.render.bind( this )

	}

	setSize ( w, h ) {
		this.canvasElement.width = w
		this.canvasElement.height = h

		let gl = this.gl

		gl.viewport( 0, 0, w, h )
		gl.clearColor(0.0, 0.0, 1.0, 1.0)
		gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
	}

	fitSize () {
		if ( this.canvasElement.parentNode) {
			let rect = this.canvasElement.parentElement.getBoundingClientRect()
			this.setSize( rect.width, rect.height )
		}
	}

	render () {

		this.fitSize()
		super.render( this, this.gl, 0, 0, 1 )

		let gl = this.gl;

		// var vertices = [
  //           -0.5,0.5,0.0,
  //           -0.5,-0.5,0.0,
  //           0.5,-0.5,0.0,
  //           0.5,0.5,0.0 
  //        ];

         var vertices = [
            0.5,0.5,0.0,
            0.5,-0.5,0.0,
            -0.5,-0.5,0.0,
            0.5,-0.5,0.0,
            -0.5,-0.5,0.0,
            -0.5,0.5,0.0,
         ];


         var indices = [0,1,2,3,4,5];

         // Create an empty buffer object to store vertex buffer
         var vertex_buffer = gl.createBuffer();

         // Bind appropriate array buffer to it
         gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

         // Pass the vertex data to the buffer
         gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

         // Unbind the buffer
         gl.bindBuffer(gl.ARRAY_BUFFER, null);

         // Create an empty buffer object to store Index buffer
         var Index_Buffer = gl.createBuffer();

         // Bind appropriate array buffer to it
         gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);

         // Pass the vertex data to the buffer
         gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

         // Unbind the buffer
         gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

         /*====================== Shaders =======================*/

         // Vertex shader source code
         var vertCode = `
         	attribute vec3 coordinates;
         	uniform vec4 u_offset;
            void main(void) {
               gl_Position = vec4(coordinates.x + u_offset.x, coordinates.y, coordinates.z, 1.0);
            }`;

         // Create a vertex shader object
         var vertShader = gl.createShader(gl.VERTEX_SHADER);

         // Attach vertex shader source code
         gl.shaderSource(vertShader, vertCode);

         // Compile the vertex shader
         gl.compileShader(vertShader);

         // Fragment shader source code
         var fragCode =
            'void main(void) {' +
               ' gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);' +
            '}';

         // Create fragment shader object 
         var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

         // Attach fragment shader source code
         gl.shaderSource(fragShader, fragCode);

         // Compile the fragmentt shader
         gl.compileShader(fragShader);

         // Create a shader program object to
         // store the combined shader program
         var shaderProgram = gl.createProgram();

         // Attach a vertex shader
         gl.attachShader(shaderProgram, vertShader);

         // Attach a fragment shader
         gl.attachShader(shaderProgram, fragShader);

         // Link both the programs
         gl.linkProgram(shaderProgram);

         // Use the combined shader program object
         gl.useProgram(shaderProgram);

         /* ======= Associating shaders to buffer objects =======*/

         // Bind vertex buffer object
         gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

         // Bind index buffer object
         gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer); 

         // Get the attribute location
         var coord = gl.getAttribLocation(shaderProgram, "coordinates");

         // Point an attribute to the currently bound VBO
         gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

         // Enable the attribute
         gl.enableVertexAttribArray(coord);

         /**/
         var offsetLoc = gl.getUniformLocation(shaderProgram, "u_offset");
         gl.uniform4fv(offsetLoc, [0.5, 0, 0, 0]);  // offset it to the right half the screen

         /*============= Drawing the Quad ================*/

         // Clear the canvas
         gl.clearColor(0.5, 0.5, 0.5, 0.9);

         // Enable the depth test
         gl.enable(gl.DEPTH_TEST);

         // Clear the color buffer bit
         gl.clear(gl.COLOR_BUFFER_BIT);

         // Set the view port
         // gl.viewport(0,0,canvas.width,canvas.highte);

         // Draw the triangle
         gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT,0);
	}
}

export default GLEngine