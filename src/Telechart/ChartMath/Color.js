import Point from "Telechart/ChartMath/Point"
import Utils from "Telechart/Utils"

class Color extends Point {
	constructor (...args) {
		super (...args)
	}

	set ( x, y, z ) {
		if ( typeof x == "object" ) {
			return this.set( x.x, x.y )
		}

		if ( typeof x == "string" ) {
			return this.setCSSHex( x )
		}
 		
		this.x = x
		this.y = y
		this.z = z
	} 

	valueOf () {
		return this.toArray()
	}

	toArray () {
		return [ this.x, this.y, this.z ]
	}

	fromArray ( array ) {
		this.x = array[0]
		this.y = array[1]
		this.z = array[2]
	}

	setCSSHex ( value ) {
		if ( this.$cssHexString == value ) {
			return
		}

		this.$cssHexString = value

		let rgb = Utils.cssHexToRGB( value ) 
		
		this.set( rgb.r, rgb.g, rgb.b )
	}  
}

export default Color