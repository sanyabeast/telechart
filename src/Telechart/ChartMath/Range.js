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

	expand ( padding ) {
		let size = this.size
		this.min -= padding.min * size
		this.max += padding.max * size
	}

	get size () { return ( this.max - this.min ) }
}

export default Range