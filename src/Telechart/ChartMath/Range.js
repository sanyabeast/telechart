class Range {
	constructor ( min, max ) {
		this.set( min, max )
	}

	set ( min, max ) {
		if ( typeof min == "object" ) {
			return this.set( min.min, min.max )
		}

		this.min = min
		this.max = max
	}

	get size () { return ( this.max - this.min ) }
	get isFinite () { return ( isFinite( this.min ) && isFinite( this.max ) ) }
}

export default Range