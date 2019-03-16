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

}

export default DataKeeper