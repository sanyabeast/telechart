import RenderingObject from "Telechart/RenderingEngine/RenderingObject"

class Circle extends RenderingObject {
	constructor ( params ) {
		super( params )
	}

	setParams ( params ) {
		super.setParams( params )

		this.$state.boundRect.w = (this.$params.radius * 2)
		this.$state.boundRect.h = (this.$params.radius * 2)
	}

	render ( engine, context2d, px, py ) {	
		px += this.$state.position.x
		py += this.$state.position.y

		this.$applyStyles( context2d )

		let position = engine.toReal( px, py )

		context2d.beginPath()
		context2d.arc( position.x, position.y, this.$params.radius, 0, ( Math.PI * 2 ), true )

		context2d.closePath()
		context2d.fill()
		context2d.stroke()

	}
}

export default Circle