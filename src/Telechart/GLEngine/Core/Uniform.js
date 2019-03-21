import Utils from "Telechart/Utils"
import ChartMath from "Telechart/ChartMath"

class Uniform {
	constructor( name, gl, shaderProgram, type, value ) {

		this.gl = gl
		this.name = name
		this.shaderProgram = this.shaderProgram
		this.type = type
		this.value = value

		this.$state = new Utils.DataKeeper( {
			loc: gl.getUniformLocation( shaderProgram, name )
		} )
	}

	update () {
		this.gl[ this.type ](this.$state.loc, this.value.toArray() )
	}
}

export default Uniform