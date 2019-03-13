import Utils from "Telechart/Utils"
import ChartMath from "Telechart/ChartMath"

class RenderingObject {
	get culled () { return this.$state.culled }

	constructor () {
		this.children = []
		this.UUID = Utils.generateRandomString( `rendering-object-${this.constructor.name}`, 16 )

		this.$styles = {
			fillStyle: "#000000",
			strokestyle: "#000000",
			linewidth: 1,
			lineJoin: "bevel"			
		}

		this.$state = {
			position: ChartMath.vec2( 0, 0 ),
			boundRect: ChartMath.rect(0, 0, 0, 0),
			culled: true,
		}

		this.$data = {}
	}

	getBoundRect () {
		return this.$state.boundRect
	}

	$applyStyles ( context2d ) {
		Utils.loopCollection( this.$styles, ( value, name )=>{
			context2d[name] = value
		} )
	}

	setStyles (params) {
		Utils.loopCollection( params, ( value, name )=>{
			this.$styles[name] = value
		} )
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
			if (  child.culled === false || !engine.isCulled( child.getBoundRect(), px, py )) {
				child.render( engine, context2d, px, py )
			} else {
				engine.incrementCulledObjectsCount()
			}
		} )
	}
}

export default RenderingObject