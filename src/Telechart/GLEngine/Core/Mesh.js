import RenderingObject from "Telechart/GLEngine/Core/RenderingObject"
import Utils from "Telechart/Utils"

class Mesh extends RenderingObject {
	constructor ( params ) {
		super( params )

		Utils.proxyProps( this, this.$params, [
			"material",
			"geometry"
		] )
	}

	render ( engine, gl, px, py, alpha ) {
		super.render( engine, gl, px, py, alpha )

		px += this.position.x
		py += this.position.y

		if ( !this.material.materialInited ) {
			this.material.init( engine, gl )
		}

		if ( !this.geometry.geometryInited ) {
			this.geometry.init( engine, gl, this.material.program )
		}

		gl.useProgram( this.material.program )

		this.geometry.bind( engine, gl, this.material.program )

		this.material.updateUniforms()

		this.material.uniforms.position.value.set( px, py )
		this.material.uniforms.worldPosition.value.set( engine.position )
		this.material.uniforms.worldScale.value.set( engine.scale )
		this.material.uniforms.viewportSize.value.set( engine.size )

		gl.drawElements(gl.TRIANGLES, this.geometry.indicesCount, gl.UNSIGNED_SHORT,0);

	}
}

export default Mesh