import Utils 			from "Telechart/Utils"
import ChartMath 		from "Telechart/ChartMath"
import TelechartModule 	from "Telechart/Core/TelechartModule"
import DOMComponent 	from "Telechart/Core/DOM/Component"
import Config 			from "Telechart/Config"

import RenderingObject 	from "Telechart/RenderingEngine/RenderingObject"
import Line 			from "Telechart/RenderingEngine/Line"
import Text 			from "Telechart/RenderingEngine/Text"
import Circle 			from "Telechart/RenderingEngine/Circle"
import Group 			from "Telechart/RenderingEngine/Group"
import DOMElement 		from "Telechart/RenderingEngine/DOMElement"

/**
 * @class
 * Canvas2D Rendering Engine
 *
 *
 */
class RenderingEngine extends Utils.aggregation( TelechartModule, RenderingObject ) {
	static RenderingObject = RenderingObject;
	static Line = Line;
	static Text = Text;
	static Circle = Circle;
	static DOMElement = DOMElement;
	static Group = Group;

	get domElement () { return this.$dom.canvasElement }

	constructor () {
		super()

		this.$modules = {
			canvas: new DOMComponent( {
				template: "canvas-element"
			} ),
			offscreenCanvas: new DOMComponent( {
				template: "canvas-element"
			} )
		}

		this.$dom = {
			canvasElement: this.$modules.canvas.domElement,
			offscreenCanvasElement: this.$modules.offscreenCanvas.domElement,
		}

		this.$temp = {
			position: ChartMath.vec2(0, 0),
			boundRect: ChartMath.rect(0, 0, 0, 0),
		}

		this.$state = {
			context2d: this.$dom.canvasElement.getContext( "2d" ),
			offscreenContext2d: this.$dom.offscreenCanvasElement.getContext( "2d" ),
			size: ChartMath.vec2( 100, 100 ),
			position: ChartMath.vec2( 0, 0 ),
			scale: ChartMath.vec2( 1, 1 ),
			viewport: ChartMath.rect( 0, 0, 0, 0 ),
			culledObjectsCount: 0,
			projectionModified: true,
			sizeNeedsUpdate: true
		}

		this.$state.context2d.imageSmoothingEnabled = false
		this.$state.offscreenContext2d.imageSmoothingEnabled = false

		Utils.proxyProps( this, this.$state, [
			"position",
			"scale",
			"viewport",
			"size"
		] )

		this.render = this.render.bind(this)
		this.updateProjection()
	}

	setScale ( x, y ) {
		this.$state.viewport.w = this.$state.size.x * x
		this.$state.viewport.h = this.$state.size.y * y

		this.updateProjection()
	}

	setPosition (x, y ) {
		y = ( typeof y == "number" ) ? y : this.$state.position.y
		this.$state.position.x = x
		this.$state.position.y = y

		this.updateProjection()
	}

	setViewport ( x, y, w, h ) {
		let viewport = this.$state.viewport

		viewport.x = x
		viewport.y = y
		viewport.w = w
		viewport.h = h

		this.$state.position.set( viewport.x, viewport.y )

		this.emit( "viewport.updated", viewport )
		this.updateProjection()
	} 

	setSize ( w, h ) {
		w *= Config.DPR
		h *= Config.DPR

		if ( this.$state.size.x === w  && this.$state.size.y === h ) {
			return
		}

		if ( !w || !h ){
			return
		}

		this.$dom.canvasElement.width = w
		this.$dom.canvasElement.height = h
		
		this.$dom.offscreenCanvasElement.width = w
		this.$dom.offscreenCanvasElement.height = h

		this.$state.size.set( w, h )

		this.updateProjection()
	}

	fitSize () {
		if ( this.domElement.parentElement ) {
			let rect = this.domElement.parentElement.getBoundingClientRect()
			this.setSize( rect.width, rect.height )
			this.$state.sizeNeedsUpdate = false
		}
	}

	prerender () {
		this.$state.culledObjectsCount = 0
		super.render( this, this.$state.offscreenContext2d, -this.$state.position.x, -this.$state.position.y, 1 )
	}

	render () {
		this.fitSize()

		if ( this.$state.projectionModified ) {
			this.$state.projectionModified = false;
			this.$state.context2d.clearRect( 0, 0, this.$state.size.x, this.$state.size.y )
			this.$state.offscreenContext2d.clearRect( 0, 0, this.$state.size.x, this.$state.size.y )
			this.prerender()

			this.$state.context2d.drawImage( this.$dom.offscreenCanvasElement, 0, 0 )
		}
	}

	toReal ( x, y ) {
		return ChartMath.point(
			Math.round( (x - this.position.x) / this.scale.x ), 
			Math.round( this.size.y - ((y - this.position.y) / this.scale.y) )
		)
	}

	toRealScale ( x, y ) {
		return ChartMath.point(
			Math.round( x / this.scale.x ),
			Math.round( y / this.scale.y ),
		)
	}

	toVirtual ( x, y ) {
		return ChartMath.point(
			( ( x * this.scale.x ) + this.position.x ),
			( ( ( this.size.y - y )   * this.scale.y ) + this.position.y ),
		)
	} 

	toVirtualScale ( x, y ) {
		return ChartMath.point(
			x * this.scale.x,
			y * this.scale.y,
		)
	}

	isCulled ( child, px, py ) {
		if ( !child.visible ) return true

		if ( !child.culled ) {
			return false
		} else {
			let boundRect = child.getBoundRect()
			let translatedRect = ChartMath.translateRect( this.$temp.boundRect, boundRect, px, py )
			child.projectionCulled = !ChartMath.rectIntersectsRect( translatedRect, this.$state.viewport )

			return child.projectionCulled
		}
	}

	updateProjection () {
		let viewport = this.$state.viewport
		let position = this.$state.position
		let size = this.$state.size

		this.$state.scale.set(
			viewport.w / size.x,
			viewport.h / size.y
		)

		viewport.x = position.x
		viewport.y = position.y

		this.$state.projectionModified = true
	}

	incrementCulledObjectsCount () { this.$state.culledObjectsCount++ }

}


export default RenderingEngine