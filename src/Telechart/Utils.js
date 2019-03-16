import aggregation from "Telechart/Utils/aggregation"
import EventProxy from "Telechart/Utils/EventProxy"
import ChartMath from "Telechart/Utils/ChartMath"
import DataKeeper from "Telechart/Utils/DataKeeper"

/**
 * @class
 * Utils.
 *
 */
let testContext2D = document.createElement( "canvas" ).getContext( "2d" )

class Utils {
	static aggregation = aggregation;
	static EventProxy = EventProxy;
	static DataKeeper = DataKeeper;
	
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
		}
	}

	static generateAttributesSelector ( attrs ) {
		let result = ""

		this.loopCollection( attrs, ( value, name )=>{
			result += `[${name}="${value}"]`
		} )

		return result
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

	/* charting */
	static normalizeChartData ( data ) {
		let datasetData = {}

		Utils.loopCollection( data.columns, ( rawData, index )=>{
			let seriesData = {}
			let seriesId = ( typeof rawData[0] == "string" ) ? ( rawData.shift() ) : ( index === 0 ? "x" : `y${index - 1}` )
			let seriesType = data.types[ seriesId ]
			let seriesName = data.names[ seriesId ]
			let seriesColor = data.colors[ seriesId ]

			switch ( seriesType ) {
				case "x":
					datasetData.time = this.processTimeRawData( rawData )
				break;
				default:
					datasetData.series = datasetData.series || {}
					datasetData.series[ seriesId ] = {
						id: seriesId,
						name: seriesName,
						type: seriesType,
						color: seriesColor,
						points: rawData
					}
				break;
			}
		} )

		return datasetData
	}

	static processTimeRawData ( rawData ) {
		let beginTime, finishTime, accuracy = null;

		Utils.loopCollection( rawData, ( unixTime, index )=>{
			if ( index == 0 ) {
				beginTime = unixTime
			} else if ( index == rawData.length - 1 ) {
				finishTime = unixTime
			}

			if ( accuracy === null && index > 0 ) {
				accuracy = unixTime - rawData[ index - 1 ]
			}
		} )

		return { beginTime, finishTime, accuracy }
	}

	static 
}

export default Utils