class Point {
	uniformType = "uniform2fv"

	x = 0;
	y = 0;

	constructor ( x, y ) {
		this.array = [0, 0];
		this.set( x, y )
	}

	set ( x, y ) {
		if ( typeof x == "object" ) {
			return this.set( x.x, x.y )
		}
		
		this.array[0] = x
		this.array[1] = y

		this.x = x
		this.y = y
	} 

	valueOf () {
		return this.y
	}

	toArray () {
		return this.array
	}

	fromArray ( array ) {
		this.set( array[0], array[1] )
	}
}

export default Point