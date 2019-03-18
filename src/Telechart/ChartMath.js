import Utils from "Telechart/Utils"

/**
 * @class
 * Math tools
 *
 *
 *
 */
class ChartMath {
	static vec2 (x, y) {
		x = x || 0
		y = y || 0
		return { x, y }
	}

	/* I have overriden the `valueOf` method so that I can easely find the minima and maxima of sequence 
	 * using `Math.max.apply(Math, ...) and Math.min.apply(Math, ...)` constructions.
	 */
	static point ( x, y ) {
		x = x || 0
		y = y || 0

		return {
			x, 
			y,
			valueOf () { return this.y }
		}
	}

	static rect (x, y, w, h) {
		x = x || 0
		y = y || 0
		w = w || 0
		h = h || 0
		return { x, y, w, h }
	}

	static translateRect ( targetRect, srcRect, x, y ) {
		targetRect.x = srcRect.x + x
		targetRect.y = srcRect.y + y
		targetRect.w = srcRect.w
		targetRect.h = srcRect.h
		
		return targetRect
	}

	static pointBelongsToRect ( point, rect ) {
		return ( point.x >= rect.x ) && ( point.x <= rect.x + rect.w ) && ( point.y >= rect.y ) && (point.y <= rect.y + rect.h)
	}

	static rectBelongsToRect ( rectA, rectB ) {
		return ( rectA.x >= rectB.x ) && ( rectA.y >= rectB.y ) && ( rectA.x + rectA.w <= rectB.x + rectB.w ) && ( rectA.y + rectA.h <= rectB.y + rectB.h )
	}

	static rectIntersectsRect ( rectA, rectB ) {
		return !( ( rectB.x > ( rectA.x + rectA.w ) ) || ( ( rectB.x + rectB.w ) < rectA.x ) || ( rectB.y > ( rectA.y + rectB.h ) ) || ( ( rectB.y + rectB.h ) < rectA.y ) )
	}

	static getExtremum ( points ) {
		let min = null;
		let max = null;

		/*Utils.loopCollection( points, (point, index)=>{
			if (min === null || point.y < min) min = point.y
			if (max === null || point.y > max) max = point.y
		} )*/

		min = Math.min.apply( Math, points )
		max = Math.max.apply( Math, points )

		return { min, max }
	}

	static getDistance ( pointA, pointB ) {
		return Math.sqrt( Math.pow( Math.abs( pointA.x - pointB.x ), 2 ) + Math.pow( Math.abs( pointA.y - pointB.y ), 2 ) )
	}
}

export default ChartMath