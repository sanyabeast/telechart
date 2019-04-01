/**
 * @author sanyabeast | github.com/sanyabeast | a.gvrnsk@gmail.com | telegram:sanyabeats
 */

 
import TelechartModule from "Telechart/Core/TelechartModule"
import Utils from "Telechart/Utils"
import Config from "Telechart/Config"
import ChartMath from "Telechart/ChartMath"

class DOMElementEventHandler extends TelechartModule {
	static eventDetectors = {
		click: function ( domElement, callback ) {
			domElement.addEventListener( "click", ( eventData )=>{
				eventData.stopPropagation()
				callback( this.$normalizeEventData( "click", eventData, domElement ) )
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
				eventData.stopPropagation()
				eventData = this.$normalizeEventData( "drag", eventData, domElement )
				prevX = eventData.pageX
				prevY = eventData.pageY
				captured = true
			} )

			window.addEventListener( releaseEventName, ( eventData )=>{
				captured = false
			} )

			window.addEventListener( moveEventName, ( eventData )=>{
				if ( captured ) {
					eventData.stopPropagation()
					eventData.preventDefault()
					eventData = this.$normalizeEventData( "drag", eventData, domElement )
					
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

		// pan: function ( domElement, callback ) {
		// 	if ( Config.isTouchDevice ) {

		// 		let captured = false
		// 		let prevPanDistance = 0

		// 		domElement.addEventListener( "touchstart", ( eventData )=>{
		// 			captured = true
		// 		} )

		// 		window.addEventListener( "touchend", ( eventData )=>{
		// 			captured = false
		// 			prevPanDistance = 0
		// 		} )

		// 		window.addEventListener( "touchmove", ( eventData )=>{
		// 			let normalizedEventData = this.$normalizeEventData( "pan", eventData, domElement )

		// 			if ( captured && normalizedEventData.isGesture && normalizedEventData.touchesCount == 2 ) {
		// 				let panDelta = prevPanDistance / normalizedEventData.panDistance
		// 				prevPanDistance = normalizedEventData.panDistance
		// 				normalizedEventData.panDelta = panDelta

		// 				callback ( normalizedEventData )					
		// 			}
		// 		}, { cancelable: true } )
		// 	}
		// },

		// zoom: function ( domElement, callback ) {
		// 	if ( !Config.isTouchDevice ) {
		// 		domElement.addEventListener( "mousewheel", ( eventData )=>{
		// 			eventData.preventDefault()
		// 			let zoomIn = eventData.wheelDeltaY > 0
		// 			eventData = this.$normalizeEventData( "zoom", eventData, domElement )
		// 			eventData.zoomIn = zoomIn
		// 			callback ( eventData )
		// 		}, { passive: false } )
		// 	}
		// },

		// doubletap: function ( domElement, callback ) {
		// 	let prevClickTime = 0

		// 	domElement.addEventListener( "click", ( eventData )=>{
		// 		eventData.preventDefault()

		// 		let now = +new Date()

		// 		if ( ( now - prevClickTime ) < Config.values.domDoubletapTimeout ) {
		// 			callback( this.$normalizeEventData( "doubletap", eventData, domElement ) )
		// 		} 

		// 		prevClickTime = now

		// 	} )
		// }
	}

	constructor (params) {
		super()

		this.$state = {
			normalizedEventData: {
				prevPanDistance: null
			},
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

	$normalizeEventData ( eventName, eventData, target ) {		
		let boundingRect = target.getBoundingClientRect()
		let evt = eventData
		let nEvt = this.$state.normalizedEventData

		nEvt.isGesture = false

		if ( eventData instanceof window.TouchEvent ) {
			nEvt = this.$normalizeTouchEventData( eventName, eventData, target )
		} else {
			nEvt.x = ( evt.pageX - boundingRect.x ) * Config.DPR	
			nEvt.y = ( evt.pageX - boundingRect.y ) * Config.DPR	
			nEvt.pageX = evt.pageX * Config.DPR
			nEvt.pageY = evt.pageY * Config.DPR		
		}

		nEvt.type = eventName
		nEvt.target = target

		this.$state.normalizedEventData.originalEvent = eventData

		return this.$state.normalizedEventData
	}

	$normalizeTouchEventData ( eventName, eventData, target ) {
		if ( eventData.touches.length > 1 ) {
			this.$state.normalizedEventData = this.$normalizeTouchGestureEventData( eventName, eventData )
		} else if ( eventData.touches.length === 1 ) {
			this.$state.normalizedEventData = this.$normalizeEventData( eventName, eventData.touches[ 0 ], target )
		} else {
			console.log( 1 )
		}

		return this.$state.normalizedEventData
	}

	$normalizeTouchGestureEventData ( eventName, eventData ) {
		this.$state.normalizedEventData.isGesture = true
		this.$state.normalizedEventData.touchesCount =  eventData.touches.length

		if ( eventData.touches.length == 2 ) {
			let panDistance = ChartMath.getDistance(
				ChartMath.point( eventData.touches[0].pageX, eventData.touches[0].pageY ),
				ChartMath.point( eventData.touches[1].pageX, eventData.touches[1].pageY ),
			)

			this.$state.normalizedEventData.panDistance = panDistance
		}

		return this.$state.normalizedEventData
	}
}

export default DOMElementEventHandler