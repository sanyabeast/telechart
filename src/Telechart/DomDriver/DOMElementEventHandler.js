import TelechartModule from "Telechart/Utils/TelechartModule"
import Utils from "Telechart/Utils"
import Config from "Telechart/Config"

class DOMElementEventHandler extends TelechartModule {
	static eventDetectors = {
		click: function ( domElement, callback ) {
			domElement.addEventListener( "click", ( eventData )=>{
				callback( this.$normalizeEventData(  "click", eventData ) )
			} )
		},

		drag: function ( domElement, callback ) {
			let prevX = 0
			let prevY = 0
			let dx = 0
			let dy = 0
			let captured = false

			let captureEventName, releaseEventName, moveEventName

			if ( Config.isTouchDevice ) {
				captureEventName = "touchstart"
				releaseEventName = "touchend"
				moveEventName = "touchmove"
			} else {
				captureEventName = "mousedown"
				releaseEventName = "mouseup"
				moveEventName = "mousemove"
			}

			domElement.addEventListener( captureEventName, ( eventData )=>{
				eventData = this.$normalizeEventData( "drag", eventData )
				prevX = eventData.pageX
				prevY = eventData.pageY
				captured = true
			} )

			window.addEventListener( releaseEventName, ( eventData )=>{
				captured = false
			} )

			window.addEventListener( moveEventName, ( eventData )=>{
				if ( captured ) {
					eventData = this.$normalizeEventData( "drag", eventData )
					dx = eventData.pageX - prevX
					dy = eventData.pageY - prevY

					prevX = eventData.pageX
					prevY = eventData.pageY

					eventData.dragX = dx
					eventData.dragY = dy

					callback ( eventData )
				}
			} )
		},

		pan: function ( domElement, callback ) {

		},

		zoom: function ( domElement, callback ) {
			if ( !Config.isTouchDevice ) {
				domElement.addEventListener( "mousewheel", ( eventData )=>{
					eventData.preventDefault()
					let zoomIn = eventData.wheelDeltaY > 0
					eventData = this.$normalizeEventData( "zoom", eventData )
					eventData.zoomIn = zoomIn
					callback ( eventData )
				} )
			}
		},

		doubletap: function ( domElement, callback ) {
			let prevClickTime = 0

			domElement.addEventListener( "click", ( eventData )=>{
				eventData.preventDefault()

				let now = +new Date()

				if ( ( now - prevClickTime ) < Config.domDoubletapTimeout ) {
					callback( eventData )
				} 

				prevClickTime = now

			} )
		}
	}

	constructor (params) {
		super()

		this.$state = {
			normalizedEventData: {},
			domElement: params.domElement,
			eventsList: params.eventsList,
		}

		Utils.loopCollection(params.eventsList, ( eventName, index )=>{
			DOMElementEventHandler.eventDetectors[eventName].call(this,  this.$state.domElement, ( data )=>{
				this.emit( data.type, data )
				this.emit( "$event", {
					type: data.type,
					payload: data
				} )
			} )
		})

	}

	$normalizeEventData ( eventName, eventData ) {
		this.$state.normalizedEventData.type = eventName
		this.$state.normalizedEventData.x = eventData.offsetX
		this.$state.normalizedEventData.Y = eventData.offsetY
		this.$state.normalizedEventData.pageX = eventData.pageX
		this.$state.normalizedEventData.pageY = eventData.pageY

		return this.$state.normalizedEventData
	}
}

export default DOMElementEventHandler