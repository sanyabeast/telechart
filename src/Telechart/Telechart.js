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

/** 
 * @class
 * Telechart. Root class.
 * @property {window.Node} domElement - root DOM element
 */
class Telechart extends TelechartModule {
	static MainLoop = MainLoop;
	static Utils = Utils;
	static EventBus = EventBus;
	static Tweener = Tweener;
	static ChartMath = ChartMath;

	MainLoop = MainLoop;
	Utils = Utils;
	EventBus = EventBus;
	ChartMath = ChartMath;

	get domElement () { return this.$modules.domDriver.domElement }

	/** 
	 * @constructor
	 */
	constructor () {
		super()

		this.$modules = {
			majorPlot: new Plot(),
			panoramaPlot: new Plot(),
			domDriver: new DomDriver()
		}

		this.$modules.domDriver.init({
			telechart: this,
			panoramaPlot: this.$modules.panoramaPlot,
			majorPlot: this.$modules.majorPlot
		})
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
		this.$modules.majorPlot.setDataset ( datasets[0] )
		this.$modules.panoramaPlot.setDataset ( datasets[0] )
	}

	addLine ( lineData ) {

	}

	removeLine ( lineData ) {

	} 

	dispose () {

	}

	setParentElement( parentElement ) {
		parentElement.appendChild( this.domElement )
	}
}

MainLoop.start()

export default Telechart