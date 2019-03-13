import RenderingEngine from "Telechart/RenderingEngine"
import Utils from "Telechart/Utils"
import TelechartModule from "Telechart/Utils/TelechartModule"
import MainLoop from "Telechart/MainLoop"
import Tweener from "Telechart/Tweener"
import ChartMath from "Telechart/ChartMath"

import plot_html from "txt!html/plot.html"

class Plot extends TelechartModule {
	get position () { return this.$modules.renderingEngine.position }
	get scale () { return this.$modules.renderingEngine.scale }
	get domElement () { return this.$dom.rootElement }

	constructor () {
		super()

		this.$dom = {
			rootElement: Utils.parseHTML( plot_html )
		}

		this.$modules = {
			renderingEngine: new RenderingEngine()
		}


		this.$createTestLines()

		this.$dom.rootElement.querySelector( ".canvas-wrapper" ).appendChild( this.$modules.renderingEngine.domElement )

		// Tweener.tween({
		// 	fromValue: 20,
		// 	toValue: 0.2,
		// 	duration: 2000,
		// 	onUpdate: (value, completed)=>{
		// 		this.$modules.renderingEngine.setScale( this.$modules.renderingEngine.scale.x, value )
		// 	}
		// })

		// Tweener.tween({
		// 	fromValue: 20,
		// 	toValue: 0.2,
		// 	duration: 1000,
		// 	onUpdate: (value, completed)=>{
		// 		this.$modules.renderingEngine.setScale( value, this.$modules.renderingEngine.scale.y )
		// 	}
		// })

		this.$modules.renderingEngine.setScale( 1, 1 )

		MainLoop.addTask( this.$modules.renderingEngine.render )
	}

	fitSize ( ...args ) {
		return this.$modules.renderingEngine.fitSize(...args)
	}

	setPosition ( ...args ) {
		return this.$modules.renderingEngine.setPosition(...args)
	}

	setScale ( ...args ) {
		return this.$modules.renderingEngine.setScale(...args)
	}

	setViewport

	toVirtual ( ...args ) {
		return this.$modules.renderingEngine.toVirtual(...args)
	}

	toVirtualScale ( ...args ) {
		return this.$modules.renderingEngine.toVirtualScale(...args)
	}

	$createTestLines () {

		this.$modules.renderingEngine.setScale( this.$modules.renderingEngine.scale.x, 30 / this.$modules.renderingEngine.size.y )

		Utils.loop( 0, 100, 1, ( i )=>{
			let line = new RenderingEngine.Line()

			let points = []

			for (var a = (i * 100); a < (i * 100) + 100; a++){
				points.push( ChartMath.point( a, Math.random() * 30 ) )
			}

			line.setPoints( points )

			line.setStyles( {
				lineWidth: 4,
				strokeColor: Utils.generateRandomCSSHexColor()
			} )

			this.$modules.renderingEngine.addChild( line )
		} )
	}
}

export default Plot