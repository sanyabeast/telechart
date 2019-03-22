class Float32 {
	uniformType = "uniform1f"
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
