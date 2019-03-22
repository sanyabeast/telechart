import Utils from "Telechart/Utils"
import ChartMath from "Telechart/ChartMath"
import Config from "Telechart/Config"

class RenderingObject {

	parentNode = null;

	constructor ( params ) {
		this.children = []
		this.UUID = Utils.generateRandomString( `rendering-object-${this.constructor.name}`, 16 )

		this.$data = {}
		this.$temp = {}
		this.$params = {}

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

	setAttributes ( attrs ) {
		Utils.loopCollection( attrs, ( value, name )=>{
			this.$hiddenDOM.setAttribute( name, value )
		} )
	} 

	setStyles ( styles ) {
		// console.log(styles)
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

	render ( engine, gl, px, py, alpha ) {
		// console.log( this )

		px += this.$state.position.x
		py += this.$state.position.y

		Utils.loopCollection( this.children, (child, index)=>{
			child.render( engine, gl, px, py, alpha )
			
			// if ( !engine.isCulled( child, px + child.position.x, py + child.position.y )) {
			// 	child.render( engine, gl, px, py )
			// } else {
			// 	engine.incrementCulledObjectsCount()
			// }
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
}

export default RenderingObject