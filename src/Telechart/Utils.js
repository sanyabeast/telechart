import aggregation from "Telechart/Utils/aggregation"
import EventProxy from "Telechart/Utils/EventProxy"
import ChartMath from "Telechart/ChartMath"

/**
 * @class
 * Utils.
 *
 */
let testContext2D = document.createElement( "canvas" ).getContext( "2d" )

class Utils {
	static aggregation = aggregation;
	static EventProxy = EventProxy;
	
	/* generic tools */
	static loopCollection ( collection, iteratee ) {
		if ( Array.isArray( collection ) ) {
			for ( let a = 0, l = collection.length; a < l; a++ ) {
				if ( iteratee( collection[a], a, collection ) ) break
			}
		} else {
			for ( let k in collection ) {
				if ( iteratee( collection[k], k, collection ) ) break
			}
		}
	}

	static loop ( from, to, increment, callback ) {
		for ( var a = from; a < to; a++ ) {
			if ( callback( a ) ) break
		}
	}

	static generateRandomString (prefix, length) {
		let string = "";

		while ( string.length < length ) {
			string = string + ( Math.random().toString( 32 ).substring( 3, 12 ) );
		}

		string = string.substring(0, length);
		return `${prefix}-${string}`
	}

	/* dom related tools */
	static parseHTML ( htmlString ) {
		let temp = document.createElement( "div" )
		temp.innerHTML = htmlString
		return temp.children[0]
	}

	static injectCSS ( id, cssString ) {
		if ( !document.querySelector( `#telechart-css-${id}` ) ) {
			document.querySelector( "head" ).appendChild( this.parseHTML( `<style id="telechart-css-${id}" type="text/css">${cssString}</style>` ) )
		}
	}

	/* array tools */

	/* misc */
	static generateRandomCSSHexColor () { return `#${( Math.floor( Math.random() * 16777215 ) ).toString("16")}` }
	static measureText ( textContent, font ) {
		testContext2D.font = font || testContext2D.font
		let height = Number( testContext2D.font.match( /\d+/ )[0] )
		let width = testContext2D.measureText( textContent ).width

		return ChartMath.vec2( width, height )
	}
}

export default Utils