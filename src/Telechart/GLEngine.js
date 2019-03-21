
class GLEngine {
	constructor () {

		this.canvasElement = document.createElement( "canvas" )
		let gl = this.gl = this.canvasElement.getContext( "webgl" )

		document.body.appendChild( this.canvasElement )
 	
		gl.clearColor(0.0, 0.0, 1.0, 1.0);                      // установить в качестве цвета очистки буфера цвета черный, полная непрозрачность
	    gl.enable(gl.DEPTH_TEST);                               // включает использование буфера глубины
	    gl.depthFunc(gl.LEQUAL);                                // определяет работу буфера глубины: более ближние объекты перекрывают дальние
	    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT); 

	}

	setSize ( w, h ) {
		this.canvasElement.width = w
		this.canvasElement.height = h

		let gl = this.gl

		gl.viewport( 0, 0, w, h )
		gl.clearColor(0.0, 0.0, 1.0, 1.0)
		gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
	}
}

export default GLEngine