/* All code written by @sanyabeast from scratch. */
import ChartMath from "Telechart/ChartMath"
import Utils from "Telechart/Utils"
import MainLoop from "Telechart/MainLoop"
import EventBus from "Telechart/EventBus"
import RenderingEngine from "Telechart/RenderingEngine"
import Tweener from "Telechart/Tweener"

import modifiers_css from "txt!css/modifiers.css"
import telechart_css from "txt!css/telechart.css"
import telechart_html from "txt!html/telechart.html"

/** 
 * @class
 * Telechart. Root class.
 *
 */
class Telechart {
	static MainLoop = MainLoop;
	static Utils = Utils;
	static EventBus = EventBus;
	static Tweener = Tweener;

	get domElement () { return this.$dom.rootElement }

	constructor () {

		this.$dom = {
			rootElement: Utils.parseHTML( telechart_html )
		}

		this.$state = {
			uuid: Utils.generateRandomString( "telechart", 16 )
		}

		Utils.injectCSS( "telechart-modifiers", modifiers_css )
		Utils.injectCSS( "telechart-app", telechart_css )

		// Tweener.tween({
		// 	fromValue: 0,
		// 	toValue: 400,
		// 	duration: 500,
		// 	ease: "easeOutQuad",
		// 	onUpdate: (v, completed)=>{ 
		// 		this.$dom.rootElement.style.transform = `translateX(${v}px) translateY(${v}px)`

		// 		if (completed) {
		// 			Tweener.tween({
		// 				duration: 250,
		// 				fromValue: 100,
		// 				toValue: 500,
		// 				ease: "easeOutQuad",
		// 				onUpdate: (v, completed)=>{
		// 					this.$dom.rootElement.style.width = `${v}px`

		// 					if (completed) {
		// 						Tweener.tween({
		// 							duration: 500,
		// 							fromValue: 100,
		// 							toValue: 200,
		// 							ease: "easeOutQuad",
		// 							onUpdate: (v, completed)=>{
		// 								this.$dom.rootElement.style.height = `${v}px`
		// 							}
		// 						})
		// 					}
		// 				}
		// 			})
		// 		}
		// 	}
		// })

		let kek = new RenderingEngine()
		MainLoop.addTask(kek.render)
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
}

MainLoop.start()

export default Telechart