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

	constructor ( params ) {
		super()
		
		this.$temp =new Utils.DataKeeper()

		this.$state = new Utils.DataKeeper( {

		} )

		this.$modules = new Utils.DataKeeper( {
			renderingEngine: new RenderingEngine(),
			domComponent: new DOMComponent( {
				template: "plot",
				...params
			} ),
		} )

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

		// this.startRendering()		
	}

	fitSize ( ...args ) { return this.$modules.renderingEngine.fitSize( ...args ) }
	setPosition ( ...args ) { return this.$modules.renderingEngine.setPosition( ...args ) }
	setScale ( ...args ) { return this.$modules.renderingEngine.setScale( ...args ) }
	setScalePriority ( ...args ) { return this.$modules.renderingEngine.setScalePriority( ...args ) }
	setViewport ( ...args ) { return this.$modules.renderingEngine.setViewport( ...args ) }

	toVirtual ( ...args ) { return this.$modules.renderingEngine.toVirtual( ...args ) }
	toVirtualScale ( ...args ) { return this.$modules.renderingEngine.toVirtualScale( ...args ) }

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

	/* debug code */
	__runDebugCode () {

		this.$modules.renderingEngine.setViewport( 0, -10, 45, 50 )

		Tweener.tween( { fromValue: 0, toValue: 200, duration: 500, onUpdate: ( v )=>{ 
			this.$modules.renderingEngine.position.x = v 
			this.$modules.renderingEngine.updateProjection()
		} } )

		Tweener.tween( { fromValue: 5, toValue: 200, duration: 500, onUpdate: ( v )=>{ 
			this.$modules.renderingEngine.viewport.w = v
			this.$modules.renderingEngine.updateProjection() 
		} } )

		let chunkSize = 10
		let chunksCount = 200
		let circleRareness = 8

		let seriesGroup = new RenderingEngine.Group( {
			attributes: {
				content: "series"
			}
		} )

		let points = []
		let smoothPeriod = 4
		let maxValue = 30

		Utils.loop( 0, chunksCount * chunkSize, 1, true, ( i )=> {
			points.push( ( Math.random() * Math.random() * Math.random() ) * maxValue )
		} )

		Utils.loopCollection( points, ( value, index )=> {
			if ( index > 0 ) {
				let sum = value
				let iterations = 0

				Utils.loop( Math.max( index - smoothPeriod, 0 ), index, 1, false, ( $index )=>{
					sum += points[$index]
					iterations++
				} )

				points[ index ] = (sum / iterations)
			}
		} )

		Utils.loop( 0, chunksCount, 1, true, ( i )=>{
			
			let pointsChunk = []

			for (var a = ( i * chunkSize ); a <= ( i * chunkSize ) + chunkSize; a++ ){
				
				let value = points[ a ]

				pointsChunk.push( ChartMath.point( a, value ) )
			}

			let line = new RenderingEngine.Line({
				styles: {
					lineWidth: 3 * Config.DPR,
					strokeStyle: "#3cc23f"
				},
				attributes: {
					index: i
				},
				points: pointsChunk
			})

			seriesGroup.addChild( line )

		} )

		points = []

		Utils.loop( 0, chunksCount * chunkSize, 1, true, ( i )=> {
			points.push(Math.random() * 30)
		} )

		Utils.loopCollection( points, ( value, index )=> {
			if ( index > 0 ) {
				let sum = value
				let iterations = 0

				Utils.loop( Math.max( index - smoothPeriod, 0 ), index, 1, false, ( $index )=>{
					sum += points[$index]
					iterations++
				} )

				points[ index ] = (sum / iterations)
			}
		} )

		Utils.loop( 0, chunksCount, 1, true, ( i )=>{
			
			let pointsChunk = []

			for (var a = ( i * chunkSize ); a <= ( i * chunkSize ) + chunkSize; a++ ){
				
				let value = points[ a ]

				pointsChunk.push( ChartMath.point( a, value ) )
			}

			let line = new RenderingEngine.Line({
				styles: {
					lineWidth: 2 * Config.DPR,
					strokeStyle: "#ed685f"
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
			fromValue: 1,
			toValue: 10,
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