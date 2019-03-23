/**
 * @author sanyabeast | github.com/sanyabeast | a.gvrnsk@gmail.com | telegram:sanyabeats
 */

 
import Utils from "Telechart/Utils"

class BufferAttribute {
	static setValue ( array, dimension, position, ...values ) {
		let startIndex = position * dimension

		Utils.loopCollection( values, ( value, index )=>{
			array[ startIndex + index ] = value
		} )
	}

	constructor ( params ) {
		this.vertices = params.vertices
		this.buffer = params.buffer
	}

	setValue ( dimension, position, ...values ) {
		BufferAttribute.setValue( this.vertices, dimension, ...values )
	}
}

export default BufferAttribute