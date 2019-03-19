import Utils from "Telechart/Utils"
import Point from "Telechart/ChartMath/Point"
import Rect from "Telechart/ChartMath/Rect"
import Vec2 from "Telechart/ChartMath/Vec2"
import Range from "Telechart/ChartMath/Range"

/**
 * @class
 * Math tools
 *
 *
 *
 */
class ChartMath {
	static vec2 (x, y) { return new Vec2( x, y ) }
	/* I have overriden the `valueOf` method so that I can easely find the minima and maxima of sequence 
	 * using `Math.max.apply(Math, ...) and Math.min.apply(Math, ...)` constructions.
	 */
	static point ( x, y ) { return new Point( x, y ) }
	static range ( min, max ) { return new Range( min, max ) }
	static rect (x, y, w, h) { return new Rect( x, y, w, h ) }

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
		return this.range( Math.min.apply( Math, points ), Math.max.apply( Math, points ) )
	}

	static getDistance ( pointA, pointB ) {
		return Math.sqrt( Math.pow( Math.abs( pointA.x - pointB.x ), 2 ) + Math.pow( Math.abs( pointA.y - pointB.y ), 2 ) )
	}

	static nearestMult (num, div, greater, include) {
        return (greater ? Math.ceil((num + (include?0:1))/div)*div: Math.floor((num - (include?0:1))/div)*div) || 0;
    }

    static getOrder (num) {
        return (num < 0) ? Math.pow(10, 1 / Math.floor(1 / Math.log10(num))): Math.pow(10, Math.floor(Math.log10(num)));
    }

    static smoothstep ( from, to, transition ) {
    	return to + ( ( from - to ) * transition )
    }

    static getStep ( from, to, position ) {
    	return ( to - position ) / ( to - from )
    }

}

export default ChartMath