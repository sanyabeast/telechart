import RenderingObject from "Telechart/RenderingEngine/RenderingObject"
import ChartMath from "Telechart/ChartMath"
import Config from "Telechart/Config"

class DOMElement extends RenderingObject {
	get scale () { return this.$params.scale }

	constructor ( params ) {
		super ( {
			scale: ChartMath.vec2( 1, 1 ),
			applyScaleX: false, 
			applyScaleY: false,
			applyPosX: true,
			applyPosY: true,
			...params
		} )

		this.$temp = {
			prevEngine: null,
			prevContext2d: null,
			prevPx: 0,
			prevPy: 0
		}

		this.$state.culled = false
	}

	render ( engine, context2d, px, py ) {		

		if ( !engine ) {
			if ( !this.$temp.prevEngine ) {
				return
			} else {
				engine = this.$temp.prevEngine
				context2d = this.$temp.prevContext2d
				px = this.$temp.prevPx
				py = this.$temp.prevPy
			}
		}

		let DPR = Config.DPR

		this.$temp.prevEngine = engine
		this.$temp.prevContext2d = context2d
		this.$temp.prevPx = px
		this.$temp.prevPy = py

		px += this.$state.position.x
		py += this.$state.position.y

		let position = engine.toReal( px, py )
		position.y = engine.size.y - position.y
		let scale = engine.toRealScale( this.$params.scale.x, this.$params.scale.y )

		let applyScaleX = this.$params.applyScaleX
		let applyScaleY = this.$params.applyScaleY
		let applyPosX = this.$params.applyPosX
		let applyPosY = this.$params.applyPosY

		this.$params.domElement.style.transform = `translate(${applyPosX?position.x/DPR:0}px, ${applyPosY?position.y/DPR:0}px)`// scale(${applyScaleX?scale.x/DPR:1}, ${applyScaleY?scale.y/DPR:1})`
		applyScaleX && ( this.$params.domElement.style.width = `${scale.x/DPR}px` )
		applyScaleY && ( this.$params.domElement.style.height = `${scale.y/DPR}px` )
	}
}

export default DOMElement