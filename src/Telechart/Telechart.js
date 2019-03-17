/* All code written by @sanyabeast from scratch. */
import ChartMath from "Telechart/Utils/ChartMath"
import Utils from "Telechart/Utils"
import MainLoop from "Telechart/MainLoop"
import EventBus from "Telechart/EventBus"
import RenderingEngine from "Telechart/RenderingEngine"
import Tweener from "Telechart/Tweener"
import TelechartModule from "Telechart/Utils/TelechartModule"
import Plot from "Telechart/Plot"
import DomDriver from "Telechart/DomDriver"
import Storage from "Telechart/Storage"
import Config from "Telechart/Config"

/** 
 * @class
 * Telechart. Root class.
 * @property {window.Node} domElement - root DOM element
 */
class Telechart extends TelechartModule {
	static Config = Config;
	static MainLoop = MainLoop;
	static Utils = Utils;
	static EventBus = EventBus;
	static Tweener = Tweener;
	static ChartMath = ChartMath;

	MainLoop = MainLoop;
	Utils = Utils;
	EventBus = EventBus;
	ChartMath = ChartMath;
	Config = Config

	get domElement () { return this.$modules.domDriver.domElement }

	/** 
	 * @constructor
	 */
	constructor () {
		super()

		this.$state = new Utils.DataKeeper( {
			renderingPaused: true
		} )

		this.$modules = new Utils.DataKeeper( {
			storage: new Storage(),
			majorPlot: new Plot( {
				plotType: "major"
			} ),
			panoramaPlot: new Plot( {
				plotType: "panorama"
			} ),
			domDriver: new DomDriver()
		} )

		this.$modules.domDriver.init({
			telechart: this,
			panoramaPlot: this.$modules.panoramaPlot,
			majorPlot: this.$modules.majorPlot
		})

		this.startRendering()

		// debug
	}

	/**
	 * @param {Object} chartData - input data
	 *
	 */
	update ( chartData ) {
		let datasets = []

		Utils.loopCollection( chartData, ( data, index )=>{
			let datasetData = Utils.normalizeChartData( data )
			datasets.push( datasetData )
		} )

		console.log( datasets )

		this.$modules.storage.importDataset( datasets[0] )
		this.$modules.majorPlot.setDataset ( datasets[0] )
		this.$modules.panoramaPlot.setDataset ( datasets[0] )
	}

	addLine ( lineData ) {

	}

	removeLine ( lineData ) {

	} 

	dispose () {

	}

	setSkin ( name ) {
		this.$modules.domDriver.applySkin( name )
	}

	setParentElement( parentElement ) {
		parentElement.appendChild( this.domElement )
	}

	startRendering () {
		if ( !this.$state.renderingPaused ) return
		this.$state.set( "renderingPaused", false )

		this.$modules.majorPlot.startRendering()
		this.$modules.panoramaPlot.startRendering()
	}

	stopRendering () {
		if ( this.$state.renderingPaused ) return
		this.$state.set( "renderingPaused", true )

		this.$modules.majorPlot.stopRendering()
		this.$modules.panoramaPlot.stopRendering()
	}
}

MainLoop.start()

export default Telechart