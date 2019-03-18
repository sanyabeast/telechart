import aggregation from "Telechart/Utils/aggregation"
import ChartMath from "Telechart/ChartMath"
import DataKeeper from "Telechart/Utils/DataKeeper"

/**
 * @class
 * Utils.
 *
 */
let testContext2D = document.createElement( "canvas" ).getContext( "2d" )

class Utils {
	static aggregation = aggregation;
	static DataKeeper = DataKeeper;
	
	/* generic tools */
	static loopCollection ( collection, iteratee ) {
		if (!collection) return
			
		if ( Array.isArray( collection ) || typeof collection.length == "number" ) {
			for ( let a = 0, l = collection.length; a < l; a++ ) {
				if ( iteratee( collection[a], a, collection ) ) break
			}
		} else {
			for ( let k in collection ) {
				if ( iteratee( collection[k], k, collection ) ) break
			}
		}
	}

	static loop ( from, to, increment, looseEquation, callback ) {
		if ( looseEquation ) {
			for ( var a = from, iteration = 0; a < to; a+=increment ) {
				if ( callback( a, iteration ) ) break
					iteration++
			}
		} else {
			for ( var a = from, iteration = 0; a <= to; a+=increment ) {
				if ( callback( a, iteration ) ) break
					iteration++
			}
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

	static assignValues ( target, source ) {
		this.loopCollection( source, ( value, key )=>{
			target[ key ] = value
		} )
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
		} else {
			document.querySelector( `#telechart-css-${id}` ).textContent = cssString
		}
	}

	static generateVarsCSS ( colors ) {
		let cssText = "";

		this.loopCollection( colors, ( value, name )=>{
			cssText += `--${name}:${value};\n`
		})

		cssText = `.telechart {${cssText}}`
		
		return cssText
	}

	static generateAttributesSelector ( attrs ) {
		let result = ""

		this.loopCollection( attrs, ( value, name )=>{
			result += `[${name}="${value}"]`
		} )

		return result
	}

	/* array tools */
	static splitToChunks ( array, chunkSize ) {
		let result = []

		this.loop( 0, ( Math.floor( array.length / chunkSize ) ), 1, false, ( index, iteration )=>{
			let chunk = array.slice( index * chunkSize, ( index * chunkSize ) + chunkSize + 1 )
			result.push( chunk )
		} )

		return result

	} 

	/* object tools */
	static defineProperty ( target, name, descriptor ) {
		Object.defineProperty( target, name, descriptor )
	}

	static proxyMethods ( target, source, methods ) {
		this.loopCollection( methods, ( methodMan, index )=>{
			target[methodMan] = function (...args) {
				return source[methodMan](...args)
			}
		} )
	}

	static proxyProps ( target, source, propNames ) {
		this.loopCollection( propNames, ( propName, index )=>{
			this.defineProperty( target, propName, {
				get: ()=>{ return source[propName] },
				set: ( v )=>{ source[propName] = v }
			} )
		} )
	}

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