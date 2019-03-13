import Utils from "Telechart/Utils"
import ChartMath from "Telechart/ChartMath"

class RenderingObject {
	get culled () { return this.$state.culled }

	constructor () {
		this.children = []
		this.UUID = Utils.generateRandomString( `rendering-object-${this.constructor.name}`, 16 )

		this.$state = {
			position: ChartMath.vec2( 0, 0 ),
			fillColor: "#000000",
			strokeColor: "#000000",
			lineWidth: 1,
			boundRect: ChartMath.rect(0, 0, 0, 0),
			culled: true,
			lineJoin: "bevel"
		}

		this.$data = {}
	}

	getBoundRect () {
		return this.$state.boundRect
	}

	$applyStyles ( context2d ) {
		context2d.fillStyle = this.$state.fillColor
		context2d.strokeStyle = this.$state.strokeColor
		context2d.lineWidth = this.$state.lineWidth
		context2d.lineJoin = this.$state.lineJoin
	}

	setStyles (params) {
		this.$state.fillColor = params.fillColor || this.$state.fillColor
		this.$state.strokeColor = params.strokeColor || this.$state.strokeColor
		this.$state.lineWidth = params.lineWidth || this.$state.lineWidth
		this.$state.lineJoin = params.lineJoin || this.$state.lineJoin
	}

	addChild ( child ) {
		this.children.push(child)
	}

	removeChild ( child ) {
		Utils.loopCollection( this.children, ($child, index)=>{
			if ( child.UUID == $child.UUID ) {
				this.children.splice(index, 1)
			}
		} )
	}

	render ( engine, context2d, px, py ) {
		px += this.$state.position.x
		py += this.$state.position.y

		Utils.loopCollection( this.children, (child, index)=>{
			if (child.culled === false || !engine.isCulled( child.getBoundRect(), px, py )) {
				child.render( engine, context2d, px, py )
			} else {
				engine.incrementCulledObjectsCount()
			}
		} )
	}
}

export default RenderingObject