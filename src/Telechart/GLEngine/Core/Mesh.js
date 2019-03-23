import RenderingObject from "Telechart/GLEngine/Core/RenderingObject"
import Utils from "Telechart/Utils"
import Config from "Telechart/Config"

class Mesh extends RenderingObject {
	constructor ( params ) {
		super( params )

		Utils.proxyProps( this, this.$params, [
			"material",
			"geometry"
		] )
	}

	render ( engine, gl, px, py, opacity ) {
		super.render( engine, gl, px, py, opacity )

		opacity *= this.opacity

		let uniforms = this.material.uniforms;

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

		uniforms.position.value.set( px, py )

		this.material.updateUniforms( {
			"worldPosition": engine.worldPosition, 
			"worldScale": engine.worldScale, 
			"viewportSize": engine.size,
			"resolution": Config.DPR,
			"opacity": opacity
		} )

		gl.drawElements(gl.TRIANGLES, this.geometry.indicesCount, gl.UNSIGNED_SHORT,0);

	}
}

export default Mesh