import Utils from "Telechart/Utils"

class DataKeeper {
	constructor ( content ) {
		this.setMultiple( content )
	}

	setMultiple ( content ) {
		Utils.loopCollection( content, ( value, key )=>{
			this[ key ] = value
		} )
	}

	set ( key, value, isGetter ) {
		if ( typeof key == "object" && typeof value == "undefined" ) {
			return this.setMultiple( key )
		}

		if ( typeof value == "function" && isGetter ) {
			Utils.defineProperty( this, key, { get: value } )
		} else {
			this[ key ] = value
		}
	}

}

export default DataKeeper