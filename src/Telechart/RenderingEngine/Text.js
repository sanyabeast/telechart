import RenderingObject from "Telechart/RenderingEngine/RenderingObject"
import Utils from "Telechart/Utils"

class Text extends RenderingObject {
	constructor ( params ) {
		super( params )
	}

	setParams ( params ) {
		super.setParams( params )
		this.$updateBoundRect()
	}

	render ( engine, context2d, px, py ) {	
		px += this.$state.position.x
		py += this.$state.position.y

		this.$applyStyles( context2d )

		let position = engine.toReal( px, py )

		context2d.fillText( this.$params.textContent, position.x, position.y )
	}

	$updateBoundRect () {
		let metrics = Utils.measureText( this.$params.textContent, this.$styles.font )
		this.$state.boundRect.w = metrics.x
		this.$state.boundRect.h = metrics.y
	}
}

export default Text