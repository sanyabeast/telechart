/**
 * @author sanyabeast | github.com/sanyabeast | a.gvrnsk@gmail.com | telegram:sanyabeats
 */

 
import Utils from "Telechart/Utils"
import Point from "Telechart/ChartMath/Point"
import Rect from "Telechart/ChartMath/Rect"
import Vec2 from "Telechart/ChartMath/Vec2"
import Color from "Telechart/ChartMath/Color"
import Range from "Telechart/ChartMath/Range"
import Float32 from "Telechart/ChartMath/Float32"

/**
 * @class
 * Math tools
 *
 *
 *
 */
class ChartMath {
    static float32 ( value ) { return new Float32( value ) }
	static vec2 (x, y) { return new Vec2( x, y ) }
	static color (x, y, z) { return new Color( x, y, z ) }
	/* I have overriden the `valueOf` method so that I can easely find the minima and maxima of sequence 
	 * using `Math.max.apply(Math, ...) and Math.min.apply(Math, ...)` constructions.
	 */
	static point ( x, y ) { return new Point( x, y ) }
	static range ( min, max ) { return new Range( min, max ) }
	static rect ( x, y, w, h ) { return new Rect( x, y, w, h ) }

	static getExtremum ( points ) {
		return this.range( Math.min.apply( Math, points ), Math.max.apply( Math, points ) )
	}

	static nearestMult (num, div, greater, include) {
        return (greater ? Math.ceil((num + (include?0:1))/div)*div: Math.floor((num - (include?0:1))/div)*div) || 0;
    }

    static getOrder (num) {
        return (num < 0) ? Math.pow(10, 1 / Math.floor(1 / Math.log10(num))): Math.pow(10, Math.floor(Math.log10(num)));
    }

    static smoothstep ( from, to, transition ) {
    	return to + ( ( from - to ) * ( 1 - transition ) )
    }

    static getStep ( from, to, position ) {
    	return 1 - ( ( to - position ) / ( to - from ) )
    }

    /* geometry */
    static vec2add ( out, a, b ) {
        out.x = a.x + b.x
        out.y = a.y + b.y
        return out
    }

    static vec2normalize ( out, a ) {
        let x = a.x
        let y = a.y
        let len = x * x + y * y

        if ( len > 0 ) {
            len = 1 / Math.sqrt( len )
            out.x = a.x * len
            out.y = a.y * len
        }

        return out
    }

    static vec2subtract ( out, a, b ) {
        out.x = a.x - b.x
        out.y = a.y - b.y

        return out
    }

    static vec2dot ( a, b ) {
        return a.x * b.x + a.y * b.y
    }

    static vec2magnitude ( a ) {
        return Math.sqrt( Math.pow( a.x, 2 ) + Math.pow( a.y, 2 ) );
    }

    static vec2set ( out, x, y ) {
        out.x = x
        out.y = y

        return out
    }

    static vec2normal ( out, dir, inverted ) {
        inverted ? this.vec2set( out, dir.y, -dir.x ) : this.vec2set( out, -dir.y, dir.x )

        return out
    }

    static vec2direction ( out, a, b ) {
        this.vec2subtract( out, a, b )
        this.vec2normalize( out, out )

        return out
    }

    static nearestPowerOfTwo ( num, greater ) {
        let degree = Math.log2( num );
        degree = greater ? Math.ceil(degree): Math.floor( degree );
        return Math.pow( 2, degree );
    }


}

export default ChartMath