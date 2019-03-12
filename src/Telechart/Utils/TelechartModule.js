import EventBus from "Telechart/EventBus"
import Utils from "Telechart/Utils"

class TelechartModule {
	constructor () {
		this.UUID = Utils.generateRandomString( this.constructor.name, 32 )
	}

	on (eventName, callback) {
		EventBus.on( `${this.UUID}/${eventName}`, callback )
	}

	emit (eventName, payload) {
		EventBus.emit( `${this.UUID}/${eventName}`, payload )
	}
}

export default TelechartModule