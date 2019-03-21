import TelechartModule from "Telechart/Core/TelechartModule"
import ChartMath from "Telechart/ChartMath"
import Utils from "Telechart/Utils"
import Config from "Telechart/Config"

import Geometry from "Telechart/GLEngine/Core/Geometry"
import Material from "Telechart/GLEngine/Core/Material"
import Mesh from "Telechart/GLEngine/Core/Mesh"
import Uniform from "Telechart/GLEngine/Core/Uniform"
import RenderingObject from "Telechart/GLEngine/Core/RenderingObject"
import DOMComponent from "Telechart/Core/DOM/Component"

class GLEngine extends Utils.aggregation( TelechartModule, RenderingObject ) {
	static Geometry = Geometry
	static Material = Material
	static Mesh = Mesh
	static RenderingObject = RenderingObject
	static Uniform = Uniform

   get domElement () { return this.$dom.canvasElement }

	constructor () {
		super()

      this.$modules = {
         canvas: new DOMComponent( {
            template: "canvas-element"
         } ),
         offscreenCanvas: new DOMComponent( {
            template: "canvas-element"
         } )
      }


      this.$dom = {
         canvasElement: this.$modules.canvas.domElement,
         offscreenCanvasElement: this.$modules.offscreenCanvas.domElement,
      }

      this.$state = {
         gl: this.$dom.canvasElement.getContext( "webgl" ),
         size: ChartMath.vec2( 100, 100 ),
         position: ChartMath.vec2( 0, 0 ),
         scale: ChartMath.vec2( 1, 1 ),
         viewport: ChartMath.rect( 0, 0, 0, 0 ),
         culledObjectsCount: 0,
         projectionModified: true,
         sizeNeedsUpdate: true
      }

      Utils.proxyProps( this, this.$state, [
         "position",
         "scale",
         "viewport",
         "size"
      ] )

 	
		// gl.clearColor(0.0, 0.0, 1.0, 1.0);                      
	 //   gl.enable(gl.DEPTH_TEST);                               
	 //   gl.depthFunc(gl.LEQUAL);                                
	 //   gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT); 

	  this.render = this.render.bind( this )

	}

	setSize ( w, h ) {
      w *= Config.DPR
      h *= Config.DPR

      if ( this.$state.size.x === w  && this.$state.size.y === h ) {
         return
      }

      if ( !w || !h ){
         return
      }

      this.$dom.canvasElement.width = w
      this.$dom.canvasElement.height = h
      
      this.$state.size.set( w, h )
      this.$state.gl.viewport( 0, 0, w, h )

      this.updateProjection()

		// this.domElement.width = w
		// this.domElement.height = h

		// let gl = this.$state.gl

		// gl.viewport( 0, 0, w, h )
		// gl.clearColor(0.0, 0.0, 1.0, 1.0)
		// gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
	}

	fitSize () {
		if ( this.domElement.parentNode) {
			let rect = this.domElement.parentElement.getBoundingClientRect()
			this.setSize( rect.width, rect.height )
		}
	}

   isCulled ( child, px, py ) {
      if ( !child.visible ) return true

      if ( !child.culled ) {
         return false
      } else {
         let boundRect = child.getBoundRect()
         let translatedRect = ChartMath.translateRect( this.$temp.boundRect, boundRect, px, py )
         child.projectionCulled = !ChartMath.rectIntersectsRect( translatedRect, this.$state.viewport )

         return child.projectionCulled
      }
   }

   updateProjection () {
      let viewport = this.$state.viewport
      let position = this.$state.position
      let size = this.$state.size

      this.$state.scale.set(
         viewport.w / size.x,
         viewport.h / size.y
      )

      viewport.x = position.x
      viewport.y = position.y

      this.$state.projectionModified = true
   }

   toReal ( x, y ) {
      return ChartMath.point(
         ( (x - this.position.x) / this.scale.x ) | 0, 
         ( this.size.y - ((y - this.position.y) / this.scale.y) ) | 0
      )
   }

   toRealScale ( x, y ) {
      return ChartMath.point(
         ( x / this.scale.x ) | 0,
         ( y / this.scale.y ) | 0,
      )
   }

   toVirtual ( x, y ) {
      return ChartMath.point(
         ( ( x * this.scale.x ) + this.position.x ),
         ( ( ( this.size.y - y )   * this.scale.y ) + this.position.y ),
      )
   } 

   toVirtualScale ( x, y ) {
      return ChartMath.point(
         x * this.scale.x,
         y * this.scale.y,
      )
   }

	render ( force ) {

      this.fitSize()

      if ( true || this.$state.projectionModified || force === true ) {
         this.$state.projectionModified = false;
         // this.$state.context2d.clearRect( 0, 0, this.$state.size.x, this.$state.size.y )
         // this.$state.offscreenContext2d.clearRect( 0, 0, this.$state.size.x, this.$state.size.y )
         super.render( this, this.$state.gl, 0, 0, 1 )
      }

      return

		let gl = this.$state.gl;

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

   updateValue ( value ) {
      this.value = value || this.value


   }
}

export default GLEngine