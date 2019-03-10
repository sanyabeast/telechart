"use strict"

/**
 * Constants
 *
 */
const TELECHART_CSS = `
	.telechart {
		border: 1px solid black;
		width: 100px;
		height: 100px;
	}
`



/**
 * @class
 * Utils.
 *
 */
class Utils {

	/* generic tools */
	static loopCollection ( collection, iteratee ) {
		if ( Array.isArray( collection ) ) {
			for ( let a = 0, l = collection.length; a < l; a++ ) {
				if ( iteratee( collection[a], a, collection ) ) break
			}
		} else {
			for ( let k in collection ) {
				if ( iteratee( collection[k], k, collection ) ) break
			}
		}
	}

	static generateRandomString (length, prefix) {
		let string = "";

		while(string.length < length) {
			string = string + (Math.random().toString(32).substring(3, 12));
		}

		string = string.substring(0, length);
		return `${prefix}-string`
	}

	/* dom related tools */
	static parseHTML ( htmlString ) {
		let temp = document.createElement("div")
		temp.innerHTML = htmlString
		return temp.children[0]
	}

	static injectCSS ( id, cssString ) {
		if ( !document.querySelector( `#telechart-css-${id}` ) ) {
			document.querySelector( "head" ).appendChild( this.parseHTML( `<style id="telechart-css-${id}" type="text/css">${cssString}</style>` ) )
		}
	}

}



/**
 * @class
 * Main Loop.
 *
 */
class MainLoop {
	static addTask ( callback ) {
		let taskId = Utils.generateRandomString( "task", 16 )
		this.$tasks = this.$tasks || {}
		this.$tasks[taskId] = callback
		return this.removeTask.bind( MainLoop, taskId )
	}

	static removeTask (taskId) {
		delete this.$tasks[taskId]
	}

	static init () {
		this.$state = {
			prevFrameTime: +new Date()
		}

		this.tick = this.tick.bind(this)
	}

	static start () {
		this.init()
		this.tick()
	}

	static stop () {
		window.cancelAnimationFrame(this.$rafId)
	}

	static tick () {
		this.$rafId = window.requestAnimationFrame( this.tick )

		let now = +new Date()
		let absFrameDelta = now - this.$state.prevFrameTime
		let relFrameDelta = absFrameDelta / (1000 / 60)
		this.$state.prevFrameTime = now

		Utils.loopCollection(this.$tasks, ( task, taskId )=>{
			task(relFrameDelta, absFrameDelta)
		} )
	}
}



/**
 * @class
 * Tweener
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


/**
 * @class
 * EventBus.
 *
 */
class EventBus {
	static on ( eventName, callback ) {
		let subscriptionId = Utils.generateRandomString( eventName, 16 )
		this.$subscriptions = this.$subscriptions || {}
		this.$subscriptions[eventName] = this.$subscriptions[eventName] || {}
		this.$subscriptions[eventName][subscriptionId] = callback
		return this.off.bind(EventBus, eventName, subscriptionId)
	}

	static emit ( eventName, payload ) {
		if ( this.$subscriptions && this.$subscriptions[eventName] ) {
			Utils.loopCollection( this.$subscriptions[eventName], ( callback )=>{
				callback(payload)
			} )
		}
	}

	static off ( eventName, subscriptionId ) {
		if ( this.$subscriptions && this.$subscriptions[eventName] && this.$subscriptions[eventName][subscriptionId] ) {
			delete this.$subscriptions[eventName][subscriptionId]
		}
	}
}



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
			rootElement: Utils.parseHTML( `<div class="telechart"></div>` )
		}

		Utils.injectCSS( "telechart-app", TELECHART_CSS )

		Tweener.tween({
			fromValue: 0,
			toValue: 400,
			duration: 500,
			ease: "easeOutQuad",
			onUpdate: (v, completed)=>{ 
				this.$dom.rootElement.style.transform = `translateX(${v}px) translateY(${v}px)`

				if (completed) {
					Tweener.tween({
						duration: 250,
						fromValue: 100,
						toValue: 500,
						ease: "easeOutQuad",
						onUpdate: (v, completed)=>{
							this.$dom.rootElement.style.width = `${v}px`

							if (completed) {
								Tweener.tween({
									duration: 500,
									fromValue: 100,
									toValue: 200,
									ease: "easeOutQuad",
									onUpdate: (v, completed)=>{
										this.$dom.rootElement.style.height = `${v}px`
									}
								})
							}
						}
					})
				}
			}
		})

	}
}

MainLoop.start()
