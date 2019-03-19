import RenderingObject from "Telechart/RenderingEngine/RenderingObject"
import Utils from "Telechart/Utils"
import ChartMath from "Telechart/ChartMath"


class Line extends RenderingObject {
	constructor ( params ) {
		super( params )

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
		
	}

	render ( engine, context2d, px, py, alpha ) {		
		let points = this.$data.points
		let started = false;

		this.$applyStyles( context2d )
		this.$applyAlpha( alpha, context2d )

		context2d.beginPath()

		Utils.loopCollection( points, ( point, index )=>{
			let position = engine.toReal( point.x, point.y )

			if ( started ) {
				context2d.lineTo( position.x, position.y )

				if ( index >= points.length - 1 ) {
					context2d.moveTo( position.x, position.y )
				}

			} else {
				started = true
				context2d.moveTo( position.x, position.y )
				context2d.lineTo( position.x, position.y )
			}	

		} )

		context2d.closePath()
		context2d.stroke()
	}
}

export default Line