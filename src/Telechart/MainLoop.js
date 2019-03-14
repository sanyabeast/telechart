import Utils from "Telechart/Utils"

/**
 * @class
 * Main Loop
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
		delete this.$tasks[ taskId ]
	}

	static init () {
		this.$state = {
			prevFrameTime: +new Date()
		}

		this.tick = this.tick.bind( this )
	}

	static start () {
		this.stop()
		this.init()
		this.tick()
	}

	static stop () {
		window.cancelAnimationFrame( this.$rafId )
	}

	static tick () {
		this.$rafId = window.requestAnimationFrame( this.tick )

		let now = +new Date()
		let absFrameDelta = now - this.$state.prevFrameTime
		let relFrameDelta = absFrameDelta / ( 1000 / 60 )
		this.$state.prevFrameTime = now

		Utils.loopCollection( this.$tasks, ( task, taskId )=>{
			task( relFrameDelta, absFrameDelta )
		} )
	}
}

export default MainLoop