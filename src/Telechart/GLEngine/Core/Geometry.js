import BufferAttribute from "Telechart/GLEngine/Core/BufferAttribute"
import Utils from "Telechart/Utils"

class Geometry {
	get geometryInited () { return this.$state.geometryInited }
	get indicesCount () { return this.$state.indices.length }

	constructor ( params ) {
		console.log( params )
		this.$state = new Utils.DataKeeper( {
			geometryInited: false,
			indicesInitialized: false,
			attributesData: params.attributes
		} )

		this.attributes = new Utils.DataKeeper( )

	}

	init ( engine, gl ) {
		this.$state.geometryInited = true
		
		Utils.loopCollection( this.$state.attributesData, ( vertices, name )=>{
			this.$addAttribute( engine, gl, name, vertices )
		} )

        this.$state.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.$state.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( this.$state.indices ), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

	}

	$addAttribute ( engine, gl, name, vertices ) {
		if ( !this.$state.indicesInitialized ) {
			this.$generateIndices( vertices.length/ 2 )
		}

		this.attributes[ name ] = {
			vertices: vertices,
			buffer: gl.createBuffer(),
		}

		gl.bindBuffer( gl.ARRAY_BUFFER, this.attributes[ name ].buffer );
        gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.bindBuffer( gl.ARRAY_BUFFER, null);
	}

	$generateIndices ( verticesCount ) {
		let indices = []

		Utils.loop( 0, verticesCount, 1, true, ( i )=>{
			indices[i] = i
		} )

		this.$state.indicesInitialized = true
		this.$state.indices = indices
	} 

	bindAttribute ( name, engine, gl, shaderProgram ) {
		let buffer = this.attributes[ name ].buffer

		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.$state.indexBuffer); 

        let coord = gl.getAttribLocation(shaderProgram, name);

        gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(coord);
	}
}

export default Geometry