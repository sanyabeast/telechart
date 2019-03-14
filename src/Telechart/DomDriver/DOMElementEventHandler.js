import TelechartModule from "Telechart/Utils/TelechartModule"
import Utils from "Telechart/Utils"
import Config from "Telechart/Config"

class DOMElementEventHandler extends TelechartModule {
	static eventDetectors = {
		click: function ( domElement, callback ) {
			domElement.addEventListener( "click", ( eventData )=>{
				callback( this.$normalizeEventData( "click", eventData ) )
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
					eventData.preventDefault()
					eventData = this.$normalizeEventData( "drag", eventData )
					dx = eventData.pageX - prevX
					dy = eventData.pageY - prevY

					prevX = eventData.pageX
					prevY = eventData.pageY

					eventData.dragX = dx
					eventData.dragY = dy

					callback ( eventData )
				}
			}, { passive: false })
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
				}, { passive: false } )
			}
		},

		doubletap: function ( domElement, callback ) {
			let prevClickTime = 0

			domElement.addEventListener( "click", ( eventData )=>{
				eventData.preventDefault()

				let now = +new Date()

				if ( ( now - prevClickTime ) < Config.values.domDoubletapTimeout ) {
					callback( this.$normalizeEventData( "doubletap", eventData ) )
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
		if ( eventData instanceof window.TouchEvent ) {
			this.$state.normalizedEventData = this.$normalizeTouchEventData( eventName, eventData )
		} else {
			this.$state.normalizedEventData.x = eventData.offsetX * window.devicePixelRatio	
			this.$state.normalizedEventData.y = eventData.offsetY * window.devicePixelRatio	
			this.$state.normalizedEventData.pageX = eventData.pageX * window.devicePixelRatio
			this.$state.normalizedEventData.pageY = eventData.pageY * window.devicePixelRatio		
		}

		this.$state.normalizedEventData.type = eventName
		return this.$state.normalizedEventData
	}

	$normalizeTouchEventData ( eventName, eventData ) {
		if ( eventData.touches.length > 1 ) {
			this.$state.normalizedEventData = this.$normalizeTouchGestureEventData( eventName, eventData )
		} else if ( eventData.touches.length === 1 ) {
			this.$state.normalizedEventData = this.$normalizeEventData( eventName, eventData.touches[ 0 ] )
		} else {
			console.log( 1 )
		}

		return this.$state.normalizedEventData
	}

	$normalizeTouchGestureEventData ( eventName, eventData ) {

	}
}

export default DOMElementEventHandler