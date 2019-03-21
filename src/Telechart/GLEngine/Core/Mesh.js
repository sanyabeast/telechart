import RenderingObject from "Telechart/GLEngine/Core/RenderingObject"

class Mesh extends RenderingObject {
	constructor ( geometry, material ) {
		super()

		this.geometry = geometry
		this.material = material
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

		this.geometry.bindAttribute( "coords", engine, gl, this.material.program )

		gl.drawElements(gl.TRIANGLES, this.geometry.indicesCount, gl.UNSIGNED_SHORT,0);

	}
}

export default Mesh