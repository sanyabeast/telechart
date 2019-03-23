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

		let shaderProgram = this.$state.shaderProgram = gl.createProgram();

		gl.attachShader(shaderProgram, this.$state.vertexShader);
	    gl.attachShader(shaderProgram, this.$state.fragmentShader);
	    
	    this.$linkProgram( gl )
	    this.$initUniforms( engine, gl )
	}

	$compileShader ( engine, gl, type, shaderCode ) {
		let shader = gl.createShader( type == "vertex" ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER );

		gl.shaderSource( shader, Utils.stringTemplate( shaderCode, {
			maxShaderPrecision: engine.maxShaderPrecision
		} ) )
		gl.compileShader( shader )

		let compileSuccess = gl.getShaderParameter( shader, gl.COMPILE_STATUS );
		
		if ( !compileSuccess ) {
			console.log( `Shader compilation failed: ${gl.getShaderInfoLog( shader )} `)
		}

		return shader
	}

	$initUniforms ( engine, gl ) {

		this.addMultipleUniforms( gl, this.$state.uniformsData )
		this.addMultipleUniforms( gl, {
			"position": ChartMath.vec2( 0, 0 ),
			"worldPosition": ChartMath.vec2( 0, 0 ),
			"worldScale": ChartMath.vec2( 0, 0 ),
			"viewportSize":  ChartMath.vec2( 0, 0 ),
			"resolution": ChartMath.float32( 1 ),
			"opacity": ChartMath.float32( 1 )
		} )
		
	}

	$linkProgram ( gl ) {
		gl.linkProgram( this.$state.shaderProgram )
	}

	addMultipleUniforms ( gl, uniformsData ) {
		Utils.loopCollection( uniformsData, ( uniformValue, uniformName )=>{
			this.addUniform( uniformName, gl, this.$state.shaderProgram, uniformValue )
		} )
	}

	addUniform ( name, gl, shaderProgram, value ) {
		this.uniforms[ name ] = new Uniform( name, gl, shaderProgram, value )
	}

	updateUniforms ( uniformsData ) {
		if ( uniformsData ) {
			Utils.loopCollection( uniformsData, ( uniformValue, uniformName )=>{
				this.uniforms[ uniformName ].value.set( uniformValue )
			} )
		} 

		Utils.loopCollection( this.uniforms, ( uniform, name )=>{
			uniform.update()
		} )
	}
}

export default Material