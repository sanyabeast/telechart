import Utils from "Telechart/Utils"
import ChartMath from "Telechart/ChartMath"
import RenderingProgram from "Telechart/RenderingEngine/RenderingProgram"
import TelechartModule from "Telechart/Utils/TelechartModule"

import canvas_html from "txt!html/canvas.html"

/**
 * @class
 * Canvas2D Rendering Engine
 *
 *
 */
class RenderingEngine extends TelechartModule {
	static RenderingProgram = RenderingProgram;

	get domElement () { return this.$dom.canvasElement }
	get position () { return this.$state.position }
	get viewport () { return this.$state.viewport }
	get size () { return this.$state.size }

	constructor () {
		super()

		this.$dom = {
			canvasElement: Utils.parseHTML( canvas_html ),
			offscreenCanvasElement: Utils.parseHTML( canvas_html ),
		}

		this.$state = {
			DPR: window.devicePixelRatio,
			context2d: this.$dom.canvasElement.getContext("2d"),
			offscreenContext2d: this.$dom.offscreenCanvasElement.getContext("2d"),
			size: ChartMath.vec2(100, 100),
			viewport: ChartMath.vec2(100, 100),
			position: ChartMath.vec2(0, 0)
		}

		this.$tasks = {}

		this.render = this.render.bind(this)
	}

	setViewport ( w, h ) {
		this.$state.viewport.x = w
		this.$state.viewport.y = h
	}

	setPosition (x, y ) {
		this.$state.position.x = x
		this.$state.position.y = y
	}

	setSize ( w, h ) {
		w *= this.$state.DPR
		h *= this.$state.DPR

		this.$dom.canvasElement.width = w
		this.$dom.canvasElement.height = h

		this.$state.size.x = w
		this.$state.size.y = h

		this.$state.context2d.fillRect(20, 20, 20, 20);
	}

	fitSize () {
		if ( this.domElement.parentElement ) {
			let rect = this.domElement.parentElement.getBoundingClientRect()
			this.setSize( rect.width, rect.height )
		}
	}

	prerender () {
		Utils.loopCollection( this.$tasks, ( task )=>{
			task()
		} )
	}

	render () {
		this.prerender()
		this.$state.context2d.drawImage( this.$dom.offscreenCanvasElement, 0, 0 )
	}

	addTask (task) {
		let taskId = Utils.generateRandomString( "rendering-task", 16 )
		this.$tasks[taskId] = task
	}

	removeTask () {

	}
}


export default RenderingEngine