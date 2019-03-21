import BufferAttribute from "Telechart/GLEngine/Core/BufferAttribute"
import Utils from "Telechart/Utils"

class Geometry {
	constructor ( params ) {
		console.log( params )
		this.$state = new Utils.DataKeeper( {
			indicesInitialized: false
		} )

		this.attributes = new Utils.DataKeeper( )

		Utils.loopCollection( params.attributes, ( vertices, name )=>{
			this.$addAttribute( name, vertices )
		} )
	}

	$addAttribute ( name, vertices ) {
		if ( !this.$state.indicesInitialized ) {
			this.$generateIndices( vertices.length/ 2 )
		}

		this.attributes[ name ] = {
			vertices: vertices,
		}

		// console.log( name, vertices, this )
	}

	$generateIndices ( verticesCount ) {
		let indices = []

		Utils.loop( 0, verticesCount, 1, true, ( i )=>{
			indices[i] = i
		} )

		this.$state.indicesInitialized = true
		this.$state.indices = indices
	} 
}

export default Geometry