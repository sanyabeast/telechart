/**
 * @author sanyabeast | github.com/sanyabeast | a.gvrnsk@gmail.com | telegram:sanyabeats
 */

 
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

		if ( params.points ) {
			this.setAttributesData( this.$generateLineGeometry( params.points ) )
		}
	}

	$generateLineGeometry ( points ) {
		let cv = [] // coord vertices
		let nv = [] // normal vertices
		let vi = 0 // vertex index

		let set = BufferAttribute.setValue

		Utils.loopCollection( points, ( p, index )=>{

			let np = ( index < points.length - 2 ) ? points[ index + 1 ] : points[ index - 1 ] // next point or prev point for the last one
			let dr = ChartMath.vec2direction( this.$temp.direction, p, np ) // direction
			let nn = ChartMath.vec2normal( this.$temp.negNormal, dr, false ) // negative normal vertex
			let pn = ChartMath.vec2normal( this.$temp.posNormal, dr, true ) // positive normal vector

			/* top triangle */
			set( cv, 2, vi  , p.x, p.y )
			set( nv, 2, vi++, nn.x, nn.y )

			set( cv, 2, vi  , np.x, np.y )
			set( nv, 2, vi++, nn.x, nn.y )

			set( cv, 2, vi  , p.x, p.y )
			set( nv, 2, vi++, pn.x, pn.y )

			/* bottom triangle */
			set( cv, 2, vi  , p.x, p.y )
			set( nv, 2, vi++, pn.x, pn.y )

			set( cv, 2, vi  , np.x, np.y )
			set( nv, 2, vi++, nn.x, nn.y )

			set( cv, 2, vi  , np.x, np.y )
			set( nv, 2, vi++, pn.x, pn.y )
		} )


		return {
			coords: cv,
			normal: nv
		}
	}
}

export default LineGeometry