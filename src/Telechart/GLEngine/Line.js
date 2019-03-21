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

		this.$temp.direction = ChartMath.vec2( 0, 0 )
		this.$temp.negNormal = ChartMath.vec2( 0, 0 )
		this.$temp.posNormal = ChartMath.vec2( 0, 0 )

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

		let vertexIndex = 0

		Utils.loopCollection( points, ( point, index )=>{

			if ( index < points.length - 2 ) {
				let nextPoint = points[ index + 1 ]

				let direction = ChartMath.vec2direction( this.$temp.direction, point, nextPoint )
				let negNormal = ChartMath.vec2normal( this.$temp.negNormal, direction, false )
				let posNormal = ChartMath.vec2normal( this.$temp.posNormal, direction, true )

				console.log(direction, negNormal, posNormal)

				/* top triangle */
				BufferAttribute.setValue( coordsVertices, 2, vertexIndex  , point.x, point.y )
				BufferAttribute.setValue( normalVertices, 2, vertexIndex++, negNormal.x, negNormal.y )

				BufferAttribute.setValue( coordsVertices, 2, vertexIndex  , nextPoint.x, nextPoint.y )
				BufferAttribute.setValue( normalVertices, 2, vertexIndex++, negNormal.x, negNormal.y )

				BufferAttribute.setValue( coordsVertices, 2, vertexIndex  , point.x, point.y )
				BufferAttribute.setValue( normalVertices, 2, vertexIndex++, posNormal.x, posNormal.y )

				/* bottom triangle */
				BufferAttribute.setValue( coordsVertices, 2, vertexIndex  , point.x, point.y )
				BufferAttribute.setValue( normalVertices, 2, vertexIndex++, posNormal.x, posNormal.y )

				BufferAttribute.setValue( coordsVertices, 2, vertexIndex  , nextPoint.x, nextPoint.y )
				BufferAttribute.setValue( normalVertices, 2, vertexIndex++, negNormal.x, negNormal.y )

				BufferAttribute.setValue( coordsVertices, 2, vertexIndex  , nextPoint.x, nextPoint.y )
				BufferAttribute.setValue( normalVertices, 2, vertexIndex++, posNormal.x, posNormal.y )
			}
			
		} )

		console.log( coordsVertices, normalVertices )

		return {
			coords: coordsVertices,
			normal: normalVertices
		}
	}
}

export default Line