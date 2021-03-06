/**
 * @author sanyabeast | github.com/sanyabeast | a.gvrnsk@gmail.com | telegram:sanyabeats
 */

 
import Utils from "Telechart/Utils"
import ChartMath from "Telechart/ChartMath"

class Series {
	constructor ( seriesId, seriesData, timeData ) {
		this.id = seriesId
		this.name = seriesData.name

		this.$state = new Utils.DataKeeper( {
			beginTime: 0,
			finishTime: 0,
			accuracy: 1,
			id: seriesData.id,
			color: seriesData.color,
			type: seriesData.type,
			visible: true
		} )

		Utils.proxyProps( this, this.$state, [
			"accuracy", 		
			"beginTime", 		
			"finishTime", 		
			"id", 				
			"color", 			
			"type", 			
			"visible", 		
		] )

		this.$content = new Utils.DataKeeper()
		this.$setSeriesData( seriesData, timeData )
		
	}

	$setSeriesData ( seriesData, timeData ) {
		let beginTime = this.$state.beginTime = timeData.beginTime
		let finishTime = this.$state.finishTime = timeData.finishTime
		let accuracy = this.$state.accuracy = timeData.accuracy

		let layer = []

		Utils.loop( beginTime, finishTime, accuracy, false, ( unixTime, iteration )=>{
			layer.push( ChartMath.point( unixTime, seriesData.points[ iteration ] ) )
		} )

		this.$content[ accuracy ] = layer
	}

	getLayer () {
		let accuracy = this.$state.accuracy
		let layer = this.$content[ accuracy ]
		return layer || null
	}

	slice ( from, to ) {
		let accuracy = this.$state.accuracy

		from -= accuracy
		to += accuracy

		if ( from < this.$state.beginTime ) from = this.$state.beginTime
		if ( to > this.$state.finishTime ) to = this.$state.finishTime

		
		to = ChartMath.nearestMult( to, accuracy, true, true )

		from =  (from - this.$state.beginTime) / accuracy
		to =  (to - this.$state.beginTime + accuracy) / accuracy

		return this.getLayer( accuracy ).slice( from, to )
	}

	getExtremum ( from, to ) {
		let piece = this.slice( from, to )
		let extremum = ChartMath.getExtremum(piece)
		return extremum
	}

	getValueAt ( position ) {
		let accuracy = this.$state.accuracy
		let layer = this.getLayer()

		if ( position < this.$state.beginTime ) position = this.$state.beginTime
		if ( position > this.$state.finishTime ) position = this.$state.finishTime

		let from = position

		from = ChartMath.nearestMult( position, accuracy, false, true )

		let to = from + accuracy
		let step = ChartMath.getStep( from, to, position )

		from =  (from - this.$state.beginTime) / accuracy
		to =  (to - this.$state.beginTime) / accuracy

		if ( typeof layer[to] == "undefined" ) to = from

		let intermediateValue = ChartMath.smoothstep( layer[from], layer[to], step )

		return ChartMath.point( position, intermediateValue )
	}
}

export default Series