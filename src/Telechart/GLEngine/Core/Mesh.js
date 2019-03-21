import RenderingObject from "Telechart/GLEngine/Core/RenderingObject"
import Utils from "Telechart/Utils"

class Mesh extends RenderingObject {
	constructor ( params ) {
		super( params )

		console.log( params )

		Utils.proxyProps( this, this.$params, [
			"material",
			"geometry"
		] )
	}

	render ( engine, gl, px, py, alpha ) {
		super.render( engine, gl, px, py, alpha )

		if ( !this.material.materialInited ) {
			this.material.init( engine, gl )
		}

		if ( !this.geometry.geometryInited ) {
			this.geometry.init( engine, gl )
		}

		gl.useProgram( this.material.program )

		this.material.updateUniforms()

		this.material.uniforms.position.value.set( this.$state.position )
		this.material.uniforms.worldPosition.value.set( engine.position )
		this.material.uniforms.worldScale.value.set( engine.scale )

		this.geometry.bind( engine, gl, this.material.program )

		gl.drawElements(gl.TRIANGLES, this.geometry.indicesCount, gl.UNSIGNED_SHORT,0);

	}
}

export default Mesh