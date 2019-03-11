/* All code written by @sanyabeast from scratch. */
import ChartMath from "Telechart/ChartMath"
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
 *
 */
class Telechart extends TelechartModule {
	static MainLoop = MainLoop;
	static Utils = Utils;
	static EventBus = EventBus;
	static Tweener = Tweener;

	get domElement () { return this.$modules.domDriver.domElement }

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

	update ( chartData ) {
		console.log(chartData)
	}

	addLine ( lineData ) {

	}

	removeLine ( lineData ) {

	} 

	dispose () {

	}

	setParentElement( parentElement ) {
		parentElement.appendChild( this.domElement )
		this.$modules.domDriver.fitSize()
	}
}

MainLoop.start()

export default Telechart