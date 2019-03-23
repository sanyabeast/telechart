import ChartMath from "Telechart/ChartMath"
import Utils from "Telechart/Utils"
import BufferAttribute from "Telechart/GLEngine/Core/BufferAttribute"

import Geometry from "Telechart/GLEngine/Core/Geometry"


class LineGeometry extends Geometry {
	constructor ( params ) {
		super( params )

		this.$temp.setMultiple( {
			direction: ChartMath.vec2( 0, 0 ),
			negNormal: ChartMath.vec2( 0, 0 ),
			posNormal: ChartMath.vec2( 0, 0 ),
		} )

		this.setAttributesData( this.$generateRectGeometry( params.width || 1, params.height || 1 ) )
	}

	$generateRectGeometry ( width, height ) {
		return {
			coords: [
				0,  	0,
	            0,  	height,
	            width, 	0,
	            width, 	0,
	            0, 		height,
	            width, 	height,
			]
		}
	}
}

export default LineGeometry