import Utils from "Telechart/Utils";

/**
 * @class
 */
class EventProxy {
	constructor ( source, target, events, eventPrefix ) {
		eventPrefix = eventPrefix || ""; 
		this.events = [];
		Utils.loopCollection( events, ( eventName, index )=>{
			source.on( eventName, function( data ) {
				target.emit( eventPrefix + eventName, data );
			})

			this.events.push( eventPrefix + eventName );
		})
	}
}

export default EventProxy;