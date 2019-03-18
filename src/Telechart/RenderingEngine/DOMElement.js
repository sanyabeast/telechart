import RenderingObject from "Telechart/RenderingEngine/RenderingObject"
import ChartMath from "Telechart/ChartMath"

class DOMElement extends RenderingObject {
	constructor ( params ) {
		super ( {
			scale: ChartMath.vec2( 1, 1 ),
			applyScaleX: false, 
			applyScaleX: false,
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

		this.$temp.prevEngine = engine
		this.$temp.prevContext2d = context2d
		this.$temp.prevPx = px
		this.$temp.prevPy = py

		px += this.$state.position.x
		py += this.$state.position.y

		let position = engine.toReal( px, py )
		position.y = engine.scale.y - position.y
		let scale = this.$params.scale

		let applyScaleX = this.$params.applyScaleX
		let applyScaleY = this.$params.applyScaleY
		let applyPosX = this.$params.applyPosX
		let applyPosY = this.$params.applyPosY

		this.$params.domElement.style.transform = `translate(${applyPosX?position.x:0}px, ${applyPosY?position.y:0}px) scale(${applyScaleX?scale.x:1}, ${applyScaleY?scale.y:1})`
	}
}

export default DOMElement