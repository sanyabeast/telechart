import Utils 			from "Telechart/Utils"
import ChartMath 		from "Telechart/ChartMath"
import TelechartModule 	from "Telechart/Utils/TelechartModule"
import DOMComponent from "Telechart/DomDriver/Component"

import RenderingObject 	from "Telechart/RenderingEngine/RenderingObject"
import Line 			from "Telechart/RenderingEngine/Line"
import Group 			from "Telechart/RenderingEngine/Group"
import DOMLayer 		from "Telechart/RenderingEngine/RenderingObject"


/**
 * @class
 * Canvas2D Rendering Engine
 *
 *
 */
class RenderingEngine extends Utils.aggregation( TelechartModule, RenderingObject ) {

	static RenderingObject = RenderingObject;
	static Line = Line;
	static Group = Group;
	static DOMLayer = DOMLayer;

	get domElement () { return this.$dom.canvasElement }
	get position () { return this.$state.position }
	get scale () { return this.$state.scale }
	get size () { return this.$state.size }

	constructor () {
		super()

		this.$modules = {
			canvas: new DOMComponent( {
				template: "canvas"
			} ),
			offscreenCanvas: new DOMComponent( {
				template: "canvas"
			} )
		}

		this.$dom = {
			canvasElement: this.$modules.canvas.domElement,
			offscreenCanvasElement: this.$modules.offscreenCanvas.domElement,
		}

		this.$temp = {
			position: ChartMath.vec2(0, 0),
			boundRect: ChartMath.rect(0, 0, 0, 0)
		}

		this.$stats = {
			culledObjectsCount: 0
		}

		this.$state = {
			DPR: window.devicePixelRatio,
			context2d: this.$dom.canvasElement.getContext( "2d" ),
			offscreenContext2d: this.$dom.offscreenCanvasElement.getContext( "2d" ),
			size: ChartMath.vec2( 100, 100 ),
			position: ChartMath.vec2( 0, 0 ),
			scale: ChartMath.vec2( 1, 1 ),
			viewportRect: ChartMath.rect( 0, 0, 0, 0 )
		}

		this.$tasks = {}

		this.render = this.render.bind(this)

		this.$updateViewportRect()
	}

	setScale ( x, y ) {
		this.$state.scale.x = x
		this.$state.scale.y = y

		this.$updateViewportRect()
	}

	setPosition (x, y ) {
		this.$state.position.x = x
		this.$state.position.y = y

		this.$updateViewportRect()
	}

	setSize ( w, h ) {
		w *= this.$state.DPR
		h *= this.$state.DPR

		this.$dom.canvasElement.width = w
		this.$dom.canvasElement.height = h
		this.$dom.offscreenCanvasElement.width = w
		this.$dom.offscreenCanvasElement.height = h

		this.$state.size.x = w
		this.$state.size.y = h

		this.$updateViewportRect()
	}

	fitSize () {
		if ( this.domElement.parentElement ) {
			let rect = this.domElement.parentElement.getBoundingClientRect()
			this.setSize( rect.width, rect.height )
		}
	}

	prerender () {
		this.$stats.culledObjectsCount = 0
		super.render( this, this.$state.offscreenContext2d, -this.$state.position.x, -this.$state.position.y )
	}

	render () {
		this.$state.context2d.clearRect( 0, 0, this.$state.size.x, this.$state.size.y )
		this.$state.offscreenContext2d.clearRect( 0, 0, this.$state.size.x, this.$state.size.y )

		this.prerender()

		this.$state.context2d.drawImage( this.$dom.offscreenCanvasElement, 0, 0 )
	}

	toReal ( x, y ) {
		let position = this.$temp.position

		position.x = (x - this.position.x) / this.scale.x
		position.y = this.size.y - ((y - this.position.y) / this.scale.y)

		return position
	}

	toVirtual ( x, y ) {
		let position = this.$temp.position

		position.x = (x + this.position.x) * this.scale.x
		position.y = (y + this.position.y) * this.scale.y

		return position
	} 

	toVirtualScale ( x, y ) {
		let position = this.$temp.position

		position.x = (x) * this.scale.x
		position.y = (y) * this.scale.y

		return position
	}

	isCulled ( boundRect, px, py ) {
		let translatedRect = ChartMath.translateRect( this.$temp.boundRect, boundRect, px, py )
		return !ChartMath.rectIntersectsRect( translatedRect, this.$state.viewportRect )
	}

	$updateViewportRect () {
		let viewportRect = this.$state.viewportRect

		viewportRect.x = this.$state.position.x
		viewportRect.y = this.$state.position.y
		viewportRect.w = this.$state.size.x * this.$state.scale.x
		viewportRect.h = this.$state.size.y * this.$state.scale.y
	}

	incrementCulledObjectsCount () { this.$stats.culledObjectsCount++ }

}


export default RenderingEngine