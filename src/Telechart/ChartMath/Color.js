import Point from "Telechart/ChartMath/Point"

class Color extends Point {
	constructor (...args) {
		super (...args)
	}

	set ( x, y, z ) {
		if ( typeof x == "object" ) {
			return this.set( x.x, x.y )
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
}

export default Color