import RenderingEngine from "Telechart/RenderingEngine"
import Utils from "Telechart/Utils"
import TelechartModule from "Telechart/Utils/TelechartModule"
import MainLoop from "Telechart/MainLoop"
import Tweener from "Telechart/Tweener"
import ChartMath from "Telechart/ChartMath"
import DOMComponent from "Telechart/DomDriver/Component"

import plot_html from "txt!html/plot.html"

class Plot extends TelechartModule {
	get position () { return this.$modules.renderingEngine.position }
	get scale () { return this.$modules.renderingEngine.scale }

	constructor () {
		super()
		
		this.$temp = {}

		this.$modules = {
			renderingEngine: new RenderingEngine(),
			domComponent: new DOMComponent( {
				template: "plot"
			} ),
		}

		this.$modules.domComponentEventProxy = new Utils.EventProxy( this.$modules.domComponent, this, [
			"dom.drag",
			"dom.zoom",
			"dom.click"
		], "plot." )

		this.$runDebugCode()

		this.$modules.domComponent.addChild( "canvas-wrapper", this.$modules.renderingEngine.domElement )

		this.$modules.renderingEngine.setScale( 1, 1 )

		this.startRendering()		
	}

	startRendering () {
		this.stopRendering()
		this.stopRendering = MainLoop.addTask( this.$modules.renderingEngine.render )
	}

	stopRendering () {}

	setExtremum (extremum) {

	}

	fitSize ( ...args ) {
		return this.$modules.renderingEngine.fitSize( ...args )
	}

	setPosition ( ...args ) {
		return this.$modules.renderingEngine.setPosition( ...args )
	}

	setScale ( ...args ) {
		return this.$modules.renderingEngine.setScale( ...args )
	}

	setScalePriority ( ...args ) {
		return this.$modules.renderingEngine.setScalePriority( ...args )
	}

	toVirtual ( ...args ) {
		return this.$modules.renderingEngine.toVirtual( ...args )
	}

	toVirtualScale ( ...args ) {
		return this.$modules.renderingEngine.toVirtualScale( ...args )
	}

	$runDebugCode () {

		this.$modules.renderingEngine.setScale( this.$modules.renderingEngine.scale.x, 30 / this.$modules.renderingEngine.size.y )

		let chunkSize = 10
		let chunksCount = 100
		let circleRareness = 4

		Utils.loop( 0, chunksCount, 1, ( i )=>{

			let line = new RenderingEngine.Line()

			let points = []

			for (var a = ( i * chunkSize ); a < ( i * chunkSize ) + chunkSize; a++ ){
				
				let value = Math.random() * 30

				if ( a % circleRareness == 0 ) {
					let circle = new RenderingEngine.Circle( {
						radius: Math.random() * 20,
						lineWidth: 1,
						styles: {
							strokeStyle: Utils.generateRandomCSSHexColor(),
							fillStyle: "#ffffff",
						}
					} )

					circle.position.x = a
					circle.position.y = value

					this.$modules.renderingEngine.addChild( circle )
				}

				points.push( ChartMath.point( a, value ) )
			}

			line.setPoints( points )

			line.setStyles( {
				lineWidth: 3,
				strokeStyle: Utils.generateRandomCSSHexColor()
			} )

			this.$modules.renderingEngine.addChild( line )

		} )

		Tweener.tween({
			fromValue: 20,
			toValue: 0.2,
			duration: 2000,
			onUpdate: ( value, completed )=>{
				this.$modules.renderingEngine.setScale( this.$modules.renderingEngine.scale.x, value )
			}
		} )

		Tweener.tween({
			fromValue: 20,
			toValue: 0.2,
			duration: 1000,
			onUpdate: ( value, completed )=>{
				this.$modules.renderingEngine.setScale( value, this.$modules.renderingEngine.scale.y )
			}
		} )

	}
}

export default Plot