import aggregation from "Telechart/Utils/aggregation"

/**
 * @class
 * Utils.
 *
 */
class Utils {
	static aggregation = aggregation;
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
}

export default Utils