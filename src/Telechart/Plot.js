import RenderingEngine from "Telechart/RenderingEngine"
import Utils from "Telechart/Utils"
import TelechartModule from "Telechart/Utils/TelechartModule"
import MainLoop from "Telechart/MainLoop"
import Tweener from "Telechart/Tweener"
import ChartMath from "Telechart/Utils/ChartMath"
import DOMComponent from "Telechart/DomDriver/Component"

/* plot */

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
			"dom.click",
			"dom.doubletap",
			"dom.pan"
		], "plot." )

		this.__runDebugCode()

		this.$modules.domComponent.addChild( "canvas-wrapper", this.$modules.renderingEngine.domElement )

		// this.$modules.renderingEngine.setScale( 1, 1 )

		this.startRendering()		
	}

	/* CHARTING */
	setDataset ( data ) {
		console.log( data )
	}

	/* !CHARTING */

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

	/* debug code */
	__runDebugCode () {

		this.$modules.renderingEngine.setViewport( 0, 10, 45, 30 )

		let chunkSize = 10
		let chunksCount = 2000
		let circleRareness = 8

		let points = []

		Utils.loop( 0, chunksCount * chunkSize, 1, true, ( i )=> {
			points.push(Math.random() * 30)
		} )

		Utils.loop( 0, chunksCount, 1, true, ( i )=>{
			let line = new RenderingEngine.Line()

			let pointsChunk = []

			for (var a = ( i * chunkSize ); a <= ( i * chunkSize ) + chunkSize; a++ ){
				
				let value = points[ a ]

				// if ( a % circleRareness == 0 ) {
				// 	let circle = new RenderingEngine.Circle( {
				// 		radius: Math.random() * 20,
				// 		lineWidth: 1,
				// 		styles: {
				// 			strokeStyle: Utils.generateRandomCSSHexColor(),
				// 			fillStyle: "#ffffff",
				// 		}
				// 	} )

				// 	circle.position.x = a
				// 	circle.position.y = value

				// 	this.$modules.renderingEngine.addChild( circle )
				// }

				pointsChunk.push( ChartMath.point( a, value ) )
			}

			line.setPoints( pointsChunk )

			line.setStyles( {
				lineWidth: 3,
				strokeStyle: Utils.generateRandomCSSHexColor()
			} )

			this.$modules.renderingEngine.addChild( line )

		} )

	}

	__addCircle ( x, y ) {
		let circle = new RenderingEngine.Circle( {
			radius: 1,
			lineWidth: 1,
			styles: {
				strokeStyle: Utils.generateRandomCSSHexColor(),
				fillStyle: "#ffffff",
			}
		} )

		circle.position.x = x
		circle.position.y = y

		Tweener.tween( {
			fromValue: 10,
			toValue: 30,
			duration: 250,
			onUpdate: ( value, completed )=>{
				circle.radius = value
			}
		} ) 

		this.$modules.renderingEngine.addChild( circle )
	}

	__addText ( x, y, textContent ) {
		let text = new RenderingEngine.Text( {
			textContent: textContent,
			styles: {
				fillStyle: "#000000",
				font: "30px Monospace",
			}
		} )

		text.position.x = x
		text.position.y = y

		this.$modules.renderingEngine.addChild( text )
	}


}

export default Plot