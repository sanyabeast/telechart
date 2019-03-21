class Float32 {
	isSimple = true;

	constructor ( value ) {
		this.set( value )
	}

	valueOf () {
		return this.value
	}

	set ( value ) {
		this.value = value
	}
}

export default Float32
