import RenderingObject from "Telechart/RenderingEngine/RenderingObject"

class Group extends RenderingObject {
	constructor ( params ) {
		super ( params )
		this.culled = false
	}
}

export default Group