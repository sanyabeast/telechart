import RenderingObject from "Telechart/GLEngine/Core/RenderingObject"
import ChartMath from "Telechart/ChartMath"
import Config from "Telechart/Config"
import Utils from "Telechart/Utils"

class DOMElement extends RenderingObject {
	get scale () { return this.$params.scale }
	get size () { return this.$params.size }
	get soloRenderingAvailable () { return !!this.$temp.prevEngine }

	constructor ( params ) {
		super ( {
			scale: ChartMath.vec2( 1, 1 ),
			size: ChartMath.vec2( 1, 1 ),
			applyScaleX: false, 
			applyScaleY: false,
			applySizeX: false,
			applySizeY: false,
			applyPosX: true,
			applyPosY: true,
			...params
		} )

		this.$temp = {
			prevEngine: null,
			prevGl: null,
			prevPx: 0,
			prevPy: 0
		}

		this.$state.culled = false
	}

	setStyles ( styles, target ) {
		Utils.assignValues( (target||this.$params.domElement)["style"], styles )
	}

	setStyle ( styleName, styleValue ) {
		this.$params.domElement.style[ styleName ] = styleValue
	} 

	render ( engine, gl, px, py ) {		

		if ( !engine ) {
			if ( this.soloRenderingAvailable ) {
				engine = this.$temp.prevEngine
				gl = this.$temp.prevGl
				px = this.$temp.prevPx
				py = this.$temp.prevPy
				
			} else {
				return
			}
		}

		let DPR = Config.DPR

		this.$temp.prevEngine = engine
		this.$temp.prevGl = gl
		this.$temp.prevPx = px
		this.$temp.prevPy = py

		px += this.$state.position.x
		py += this.$state.position.y

		let position = engine.toReal( px, py )
		let scale = engine.toRealScale( this.$params.scale.x, this.$params.scale.y )
		let size = engine.toRealScale( this.$params.size.x, this.$params.size.y )

		let applyScaleX = this.$params.applyScaleX
		let applyScaleY = this.$params.applyScaleY
		let applySizeX = this.$params.applySizeX
		let applySizeY = this.$params.applySizeY
		let applyPosX = this.$params.applyPosX
		let applyPosY = this.$params.applyPosY

		this.$params.domElement.style.transform = 
		this.setStyle( "transform", `translate(${applyPosX?position.x/DPR:0}px, ${applyPosY?position.y/DPR:0}px) scale(${applyScaleX?scale.x/DPR:1}, ${applyScaleY?scale.y/DPR:1})` )


		applySizeX && ( this.setStyle( "width", `${size.x/DPR}px`  ) )
		applySizeY && ( this.setStyle( "height", `${size.y/DPR}px` ) )
	}
}

export default DOMElement