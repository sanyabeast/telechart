import ChartMath from "Telechart/ChartMath"
import Utils from "Telechart/Utils"

import RenderingObject from "Telechart/GLEngine/Core/RenderingObject"
import Mesh from "Telechart/GLEngine/Core/Mesh"
import Material from "Telechart/GLEngine/Core/Material"
import Geometry from "Telechart/GLEngine/Core/Geometry"
import BufferAttribute from "Telechart/GLEngine/Core/BufferAttribute"

class Line extends Mesh {
	constructor ( params ) {
		super( params )

		this.$params.material = new Material( {
			fragmentShader: "frag.default",
			vertexShader: "vert.line2d",
			uniforms: params.uniforms
		} )

		this.$params.geometry = new Geometry()

		if ( params.points ) {
			this.setPoints( params.points )
		}
	}

	setPoints ( points ) {
		this.$data.points = points

		let extremum = ChartMath.getExtremum( points )

		this.$state.boundRect.set(
			points[0].x,
			extremum.min,
			(points[points.length - 1].x) - this.$state.boundRect.x,
			extremum.size,
		)

		this.geometry.setAttributesData( this.$generateLineGeometry( points ) )
	}

	$generateLineGeometry ( points ) {
		let coordsVertices = []
		let normalVertices = []

		console.log( points )

		Utils.loopCollection( points, ( point, index )=>{
			let pointIndex = index;

			if ( index < points.length - 2 ) {
				let nextPoint = points[ index + 1 ]

				BufferAttribute.setValue( coordsVertices, 2, index, point.x, point.y )
			}
			
			console.log( this )
		} )

		console.log( coordsVertices, normalVertices )

		return {
			coords: coordsVertices,
			// normal: normalVertices
		}
	}
}

export default Line