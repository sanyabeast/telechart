class Point {
	x = 0;
	y = 0;

	constructor ( x, y ) {
		this.set( x, y )
	}

	set ( x, y ) {
		if ( typeof x == "object" ) {
			return this.set( x.x, x.y )
		}
		
		this.x = x
		this.y = y
	} 

	valueOf () {
		return this.y
	}
}

export default Point