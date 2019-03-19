import Utils from "Telechart/Utils"
import ChartMath from "Telechart/ChartMath"
import Config from "Telechart/Config"

class RenderingObject {

	static defaultStyles = {
		fillStyle: "#000000",
		strokeStyle: "#000000",
		lineWidth: 1 * Config.DPR,
		lineJoin: "bevel",
		font: "16px sans-serif",
		globalAlpha: 1
	}

	parentNode = null;

	get alpha () { return this.$styles.globalAlpha }
	set alpha ( v ) { this.$styles.globalAlpha = v }

	constructor ( params ) {
		this.children = []
		this.UUID = Utils.generateRandomString( `rendering-object-${this.constructor.name}`, 16 )

		this.$data = {}
		this.$params = {}

		this.$styles = {
			...RenderingObject.defaultStyles	
		}

		this.$state = {
			position: ChartMath.vec2( 0, 0 ),
			boundRect: ChartMath.rect(0, 0, 0, 0),
			culled: true,
			projectionCulled: true,
			visible: true
		}

		this.$setupHiddenDOM()

		if ( params ) {
			if ( this.defaultParams ) {
				this.setParams( {
					...this.defaultParams,
					params
				} )
			} else {
				this.setParams( params )

			}
		}

		Utils.proxyProps( this, this.$state, [
			"culled",
			"projectionCulled",
			"position",
			"visible"
		] )
	
	}

	getBoundRect () {
		return this.$state.boundRect
	}

	$applyStyles ( context2d ) {
		Utils.assignValues( context2d, RenderingObject.defaultStyles )
		Utils.assignValues( context2d, this.$styles )
	}

	setAttributes ( attrs ) {
		Utils.loopCollection( attrs, ( value, name )=>{
			this.$hiddenDOM.setAttribute( name, value )
		} )
	} 

	setParams ( params ) {
		Utils.loopCollection( params, ( value, name )=>{
			if ( name == "styles" ) {
				this.setStyles( value )
			} else if ( name == "attributes" ) {
				this.setAttributes( value )
			} else {
				this.$params[name] = ( typeof value != "undefined" ) ? value : this.$params.name
			}
		} )
	}

	setStyles (params) {
		Utils.assignValues( this.$styles, params )
	}

	addChild ( child ) {
		this.children.push(child)
		child.parentNode = this
		this.$hiddenDOM.appendChild( child.$hiddenDOM )
	}

	removeChild ( child ) {
		Utils.loopCollection( this.children, ($child, index)=>{
			if ( child.UUID == $child.UUID ) {
				this.$hiddenDOM.removeChild( child.$hiddenDOM )
				child.parentNode = null;
				this.children.splice(index, 1)
				return true
			}
		} )
	}

	cutOff () {
		this.parentNode && this.parentNode.removeChild( this )
	}

	render ( engine, context2d, px, py, alpha ) {
		let multipliedAlpha = this.$applyAlpha( alpha, context2d )

		px += this.$state.position.x
		py += this.$state.position.y

		Utils.loopCollection( this.children, (child, index)=>{
			if ( !engine.isCulled( child, px + child.position.x, py + child.position.y )) {
				child.render( engine, context2d, px, py, multipliedAlpha )
			} else {
				engine.incrementCulledObjectsCount()
			}
		} )
	}

	select ( attributes, iteratee ) {
		let hiddenDOMs = [...this.$hiddenDOM.querySelectorAll( Utils.generateAttributesSelector( attributes ) )]

		Utils.loopCollection( hiddenDOMs, ( hiddenDOM, index )=>{
			iteratee && iteratee ( hiddenDOM.$renderingObject, index )
			hiddenDOMs[ index ] = hiddenDOM.$renderingObject
		} )
 
		return hiddenDOMs
	}

	$setupHiddenDOM () {
		this.$hiddenDOM = document.createElement( this.constructor.name )
		this.$hiddenDOM.$renderingObject = this
		this.$hiddenDOM.setAttribute( "type", this.constructor.name )
	}

	$applyAlpha ( parentAlpha, context2d ) {
		let alpha = parentAlpha * this.$styles.globalAlpha
		context2d.globalAlpha = alpha
		return alpha
	}
}

export default RenderingObject