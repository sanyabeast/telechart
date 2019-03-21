import RenderingObject from "Telechart/GLEngine/Core/RenderingObject"

class Mesh extends RenderingObject {
	constructor ( geometry, material ) {
		super()

		this.geometry = geometry
		this.material = material

	}
}

export default Mesh