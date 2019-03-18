import Utils 			from "Telechart/Utils"
import ChartMath 		from "Telechart/ChartMath"
import TelechartModule 	from "Telechart/Utils/TelechartModule"
import DOMComponent from "Telechart/DomDriver/Component"

import RenderingObject 	from "Telechart/RenderingEngine/RenderingObject"
import Line 			from "Telechart/RenderingEngine/Line"
import Text 			from "Telechart/RenderingEngine/Text"
import Circle 			from "Telechart/RenderingEngine/Circle"
import Group 			from "Telechart/RenderingEngine/Group"
import DOMElement 			from "Telechart/RenderingEngine/DOMElement"

const DPR = window.devicePixelRatio
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
	get position () { return this.$state.position }
	get scale () { return this.$state.scale }
	get viewport () { return this.$state.viewportRect }
	get size () { return this.$state.size }

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
			viewportRect: ChartMath.rect( 0, 0, 0, 0 ),
			culledObjectsCount: 0,
			projectionModified: true,
			sizeNeedsUpdate: true
		}

		this.$tasks = {}

		this.render = this.render.bind(this)

		this.updateProjection()
	}

	setScale ( x, y ) {
		this.$state.viewportRect.w = this.$state.size.x * x
		this.$state.viewportRect.h = this.$state.size.y * y

		this.updateProjection()
	}

	setPosition (x, y ) {
		y = ( typeof y == "number" ) ? y : this.$state.position.y
		this.$state.position.x = x
		this.$state.position.y = y

		this.updateProjection()
	}

	setViewport ( x, y, w, h ) {
		let vr = this.$state.viewportRect

		vr.x = x
		vr.y = y
		vr.w = w
		vr.h = h

		this.$state.position.x = vr.x
		this.$state.position.y = vr.y

		this.updateProjection()
	} 

	setSize ( w, h ) {
		w *= DPR
		h *= DPR

		if ( this.$state.size.x === w  && this.$state.size.y === h ) {
			return
		}

		this.$dom.canvasElement.width = w
		this.$dom.canvasElement.height = h
		this.$dom.offscreenCanvasElement.width = w
		this.$dom.offscreenCanvasElement.height = h

		this.$state.size.x = w
		this.$state.size.y = h

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
		super.render( this, this.$state.offscreenContext2d, -this.$state.position.x, -this.$state.position.y )
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
		let position = this.$temp.position

		position.x = (x - this.position.x) / this.scale.x
		position.y = this.size.y - ((y - this.position.y) / this.scale.y)

		return position
	}

	toVirtual ( x, y ) {
		let position = this.$temp.position

		position.x = ( ( x * this.scale.x ) + this.position.x )
		position.y = ( ( ( this.size.y - y )   * this.scale.y ) + this.position.y )

		return position
	} 

	toVirtualScale ( x, y ) {
		let position = this.$temp.position

		position.x = (x) * this.scale.x
		position.y = (y) * this.scale.y

		return position
	}

	isCulled ( child, px, py ) {
		if ( !child.visible ) return true

		if ( !child.culled ) {
			return false
		} else {
			let boundRect = child.getBoundRect()
			let translatedRect = ChartMath.translateRect( this.$temp.boundRect, boundRect, px, py )
			child.projectionCulled = !ChartMath.rectIntersectsRect( translatedRect, this.$state.viewportRect )

			return child.projectionCulled
		}
	}

	updateProjection () {
		let vr = this.$state.viewportRect

		this.$state.scale.x = vr.w / this.$state.size.x
		this.$state.scale.y = vr.h / this.$state.size.y
		vr.x = this.$state.position.x
		vr.y = this.$state.position.y

		this.$state.projectionModified = true
	}

	incrementCulledObjectsCount () { this.$state.culledObjectsCount++ }

}


export default RenderingEngine