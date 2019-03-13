import MainLoop from "Telechart/MainLoop"

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
			let value = this.$getValue( fromValue, toValue, progress, easingFunction )
			if ( progress >= 1 ) removeTask()
			onUpdate( value, progress >= 1 )
		})

		return removeTask
	}

	static $getValue ( fromValue, toValue, progress, easingFunction ) {
		return fromValue + ( ( toValue - fromValue ) * easingFunction( progress ) )
	}
}

export default Tweener