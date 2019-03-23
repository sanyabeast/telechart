/**
 * @author sanyabeast | github.com/sanyabeast | a.gvrnsk@gmail.com | telegram:sanyabeats
 */

 
import MainLoop from "Telechart/MainLoop"
import ChartMath from "Telechart/ChartMath"

/**
 * @class
 * Tweener.
 *
 *
 */
class Tweener {
	static $easingFunctions = {
		linear: function (t) { return t },
		easeInQuad: function (t) { return t*t },
		easeOutQuad: function (t) { return t*(2-t) },
		easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
		easeInBack : function(t){ return t * t * ((2.5 + 1) * t - 2.5) },
	  	easeOutBack : function(t){ return --t * t * ((2.5 + 1) * t + 2.5) + 1 },
	};

	static tween ( params ) {
		let fromValue = params.fromValue
		let toValue = params.toValue
		let duration = params.duration
		let ease = params.ease || "easeInOutQuad"
		let easingFunction = this.$easingFunctions[ease]
		let onUpdate = params.onUpdate || function () {}
		let startDate = +new Date()

		let removeTask = MainLoop.addTask(( relDelta )=>{
			let progress = ( (+new Date() ) - startDate) / duration
			
			if ( progress >= 1 ) {
				progress = 1
				removeTask()
			}

			let value = ChartMath.smoothstep( fromValue, toValue, easingFunction( progress ) )
			onUpdate( value, progress >= 1 )
		})

		return removeTask
	}
}

export default Tweener