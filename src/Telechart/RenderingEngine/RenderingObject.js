import Utils from "Telechart/Utils"
import ChartMath from "Telechart/ChartMath"

class RenderingObject {
	get culled () { return this.$state.culled }
	set culled (v) { this.$state.culled = v }
	get projectionCulled () { return this.$state.projectionCulled }
	set projectionCulled (v) { this.$state.projectionCulled = v }
	get position () { return this.$state.position }

	constructor ( params ) {
		this.children = []
		this.UUID = Utils.generateRandomString( `rendering-object-${this.constructor.name}`, 16 )

		this.$params = {}

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
			projectionCulled: true
		}

		if ( params ) {
			this.setParams( params )
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

	setParams ( params ) {
		Utils.loopCollection( params, ( value, name )=>{
			if ( name == "styles" ) {
				this.setStyles( value )
			} else {
				this.$params[name] = ( typeof value != "undefined" ) ? value : this.$params.name
			}
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
			if ( !engine.isCulled( child, px + child.position.x, py + child.position.y )) {
				child.render( engine, context2d, px, py )
			} else {
				engine.incrementCulledObjectsCount()
			}
		} )
	}
}

export default RenderingObject