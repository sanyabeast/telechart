import EventBus from "Telechart/EventBus"
import Utils from "Telechart/Utils"

/**
 * @class
 * Basic module
 *
 */
class TelechartModule {
	get domComponent () {
		if ( this.$modules ) {
			return this.$modules.domComponent || null
		}
	}

	get domElement () {
		if ( this.domComponent ) {
			return this.domComponent.domElement
		}
	}

	constructor () {
		this.UUID = Utils.generateRandomString( this.constructor.name, 32 )
		this.$state = new Utils.DataKeeper()
		this.$modules = new Utils.DataKeeper()
		this.$temp = new Utils.DataKeeper()
	}

	on (eventName, callback) {
		EventBus.on( `${this.UUID}/${eventName}`, callback )
	}

	emit (eventName, payload) {
		EventBus.emit( `${this.UUID}/${eventName}`, payload )
	}
}

export default TelechartModule