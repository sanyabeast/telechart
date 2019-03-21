import Utils from "Telechart/Utils"

class Material {
	constructor ( params ) {

		this.$state = new Utils.DataKeeper( {
			fragmentShader: this.$compileShader( "fragment", params.fragmentShader ),
			vertexShader: this.$compileShader( "vertex", params.vertexShader ),
		} )

		this.$state.shaderProgram = gl.createProgram();

	}

	$compileShader ( type, shaderCode ) {
		console.log( type, shaderCode )
		let shader = gl.createShader( type == "vertex" ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER );

		gl.shaderSource(shader, shaderCode)
		gl.compileShader(shader)
	}
}

export default Material