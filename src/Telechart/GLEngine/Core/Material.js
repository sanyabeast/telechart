import Utils from "Telechart/Utils"
import Config from "Telechart/Config"
import ChartMath from "Telechart/ChartMath"
import Uniform from "Telechart/GLEngine/Core/Uniform"

class Material {
	get materialInited () { return this.$state.materialInited }
	get program () { return this.$state.shaderProgram }

	constructor ( params ) {

		this.$state = new Utils.DataKeeper( {
			uniformsData: params.uniforms,
			materialInited: false,
			uniformsInited: false,
			vertexShaderCode: Config.assets.shaders[ params.vertexShader ],
			fragmentShaderCode: Config.assets.shaders[ params.fragmentShader ],
		} )

		this.uniforms = new Utils.DataKeeper()
	}

	init ( engine, gl ) {
		this.$state.materialInited = true;

		this.$state.fragmentShader = this.$compileShader( engine, gl, "fragment", this.$state.fragmentShaderCode )
		this.$state.vertexShader = this.$compileShader( engine, gl, "vertex", this.$state.vertexShaderCode )

		this.$state.shaderProgram = gl.createProgram();

		gl.attachShader(this.$state.shaderProgram, this.$state.vertexShader);
	    gl.attachShader(this.$state.shaderProgram, this.$state.fragmentShader);
	    gl.linkProgram(this.$state.shaderProgram);

	    this.$initUniforms( engine, gl )
	}

	$compileShader ( engine, gl, type, shaderCode ) {
		console.log(shaderCode)
		let shader = gl.createShader( type == "vertex" ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER );

		gl.shaderSource(shader, shaderCode)
		gl.compileShader(shader)

		let compileSuccess = gl.getShaderParameter( shader, gl.COMPILE_STATUS );
		
		if ( !compileSuccess ) {
			console.log( `Shader compilation failed: ${gl.getShaderInfoLog( shader )} `)
		}

		return shader
	}

	$initUniforms ( engine, gl ) {
		let shaderProgram = this.$state.shaderProgram

		Utils.loopCollection( this.$state.uniformsData, ( data, name )=>{
			this.addUniform( name, gl, shaderProgram, data.type, data.value )
		} )

		this.addUniform( "position", gl, shaderProgram, "uniform2fv", ChartMath.vec2( 0, 0 ) )
		this.addUniform( "worldPosition", gl, shaderProgram, "uniform2fv", ChartMath.vec2( 0, 0 ) )
		this.addUniform( "worldScale", gl, shaderProgram, "uniform2fv", ChartMath.vec2( 0, 0 ) )

		console.log( this.uniforms, engine, gl, this.$state.uniformsData )
	}

	addUniform ( name, gl, shaderProgram, type, value ) {
		this.uniforms[ name ] = new Uniform( name, gl, shaderProgram, type, value )
	}

	updateUniforms () {
		Utils.loopCollection( this.uniforms, ( uniform, name )=>{
			uniform.update()
		} )
	}
}

export default Material