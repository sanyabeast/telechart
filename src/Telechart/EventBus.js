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

export default EventBus