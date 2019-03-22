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

		this.array[0] = x
		this.array[1] = y
		this.array[2] = z

		this.x = x
		this.y = y
		this.z = z
	} 

	valueOf () {
		return this.toArray()
	}

	toArray () {
		return this.array
	}

	fromArray ( array ) {
		this.set( array[0], array[1], array[2] )
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