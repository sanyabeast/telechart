import RenderingEngine from "Telechart/RenderingEngine"
import Utils from "Telechart/Utils"
import TelechartModule from "Telechart/Utils/TelechartModule"
import MainLoop from "Telechart/MainLoop"
import Tweener from "Telechart/Tweener"
import ChartMath from "Telechart/Utils/ChartMath"
import DOMComponent from "Telechart/DomDriver/Component"
import Config from "Telechart/Config"

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

		Tweener.tween( { fromValue: 0, toValue: 3000, duration: 120000, onUpdate: ( v )=>{ 
			this.$modules.renderingEngine.position.x = v 
			this.$modules.renderingEngine.updateProjection()
		} } )

		Tweener.tween( { fromValue: 5, toValue: 60, duration: 120000, onUpdate: ( v )=>{ 
			this.$modules.renderingEngine.viewport.w = v
			this.$modules.renderingEngine.updateProjection() 
		} } )

		let chunkSize = 10
		let chunksCount = 2000
		let circleRareness = 8

		let seriesGroup = new RenderingEngine.Group( {
			attributes: {
				content: "series"
			}
		} )

		let points = []

		Utils.loop( 0, chunksCount * chunkSize, 1, true, ( i )=> {
			points.push(Math.random() * 30)
		} )

		Utils.loop( 0, chunksCount, 1, true, ( i )=>{
			
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

			let line = new RenderingEngine.Line({
				styles: {
					lineWidth: 3 * Config.DPR,
					strokeStyle: Utils.generateRandomCSSHexColor()
				},
				attributes: {
					index: i
				},
				points: pointsChunk
			})

			seriesGroup.addChild( line )

		} )

		this.$modules.renderingEngine.addChild( seriesGroup )

	}

	__addCircle ( x, y ) {
		let circle = new RenderingEngine.Circle( {
			radius: 1,
			lineWidth: 1 * Config.DPR,
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

		Tweener.tween( {
			fromValue: this.$modules.renderingEngine.viewport.h,
			toValue: Math.random() * 30 + 30,
			duration: 250,
			onUpdate: ( value )=>{
				this.$modules.renderingEngine.viewport.h = value
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
			},
			attributes: {
				bar: (Math.random() > 0.5) ? "1" : ""
			}
		} )

		text.position.x = x
		text.position.y = y

		this.$modules.renderingEngine.addChild( text )
	}


}

export default Plot