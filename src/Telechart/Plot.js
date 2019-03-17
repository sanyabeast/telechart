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

		this.$modules.domComponent.addChild( "canvas-wrapper", this.$modules.renderingEngine.domElement )
	}

	fitSize ( ...args ) { return this.$modules.renderingEngine.fitSize( ...args ) }
	setPosition ( ...args ) { return this.$modules.renderingEngine.setPosition( ...args ) }
	setScale ( ...args ) { return this.$modules.renderingEngine.setScale( ...args ) }
	setScalePriority ( ...args ) { return this.$modules.renderingEngine.setScalePriority( ...args ) }
	setViewport ( ...args ) { return this.$modules.renderingEngine.setViewport( ...args ) }

	toVirtual ( ...args ) { return this.$modules.renderingEngine.toVirtual( ...args ) }
	toVirtualScale ( ...args ) { return this.$modules.renderingEngine.toVirtualScale( ...args ) }

	/* CHARTING */
	addSeries ( seriesData ) {

		let pointsChunks = Utils.splitToChunks( seriesData.points, Config.plotChunkSize )
		let seriesGroup = new RenderingEngine.Group( {
			attributes: {
				"content-type": "series",
				"series-type": seriesData.series.type,
				"series-name": seriesData.series.name,
				"series-id": seriesData.series.id,
				"accuracy": seriesData.series.accuracy
			}
		} )

		Utils.loopCollection( pointsChunks, ( chunk, chunkIndex )=>{
			let line = new RenderingEngine.Line({
				styles: {
					lineWidth: 3 * Config.DPR,
					strokeStyle: seriesData.series.color
				},
				points: chunk
			})


			seriesGroup.addChild( line )
		} )

		this.setViewport( 
			seriesData.series.beginTime, 
			seriesData.extremum.min, 
			seriesData.series.finishTime - seriesData.series.beginTime,
			seriesData.extremum.max - seriesData.extremum.min 
		)

		this.setPosition( seriesData.series.beginTime )
		this.$modules.renderingEngine.addChild( seriesGroup )

	}
	/* !CHARTING */

	startRendering () {
		this.stopRendering()
		this.stopRendering = MainLoop.addTask( this.$modules.renderingEngine.render )
	}

	render () {
		this.$modules.renderingEngine.render()
	}

	stopRendering () {}

	setExtremum ( extremum ) {

	}

	/* debug code */
	__addCircle ( x, y ) {
		let circle = new RenderingEngine.Circle( {
			radius: 10,
			lineWidth: 1 * Config.DPR,
			styles: {
				strokeStyle: Utils.generateRandomCSSHexColor(),
				fillStyle: "#ffffff",
			}
		} )

		circle.position.x = x
		circle.position.y = y

		// Tweener.tween( {
		// 	fromValue: 1,
		// 	toValue: 10,
		// 	duration: 250,
		// 	onUpdate: ( value, completed )=>{
		// 		circle.radius = value
		// 	}
		// } ) 

		console.log( circle )

		this.$modules.renderingEngine.addChild( circle )
		this.$modules.renderingEngine.updateProjection()
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