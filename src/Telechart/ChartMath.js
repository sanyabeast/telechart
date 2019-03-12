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

	static getMinMax ( points ) {
		let min = null;
		let max = null;

		Utils.loopCollection( points, (point, index)=>{
			if (min === null || point.y < min) min = point.y
			if (max === null || point.y > max) max = point.y
		} )

		return { min, max }

	}
}

export default ChartMath