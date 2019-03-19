import Utils from "Telechart/Utils"
import ChartMath from "Telechart/ChartMath"

class Series {
	get originalAccuracy () { return this.$state.originalAccuracy }
	get accuracy () { return this.$state.accuracy }
	get beginTime () { return this.$state.beginTime }
	get finishTime () { return this.$state.finishTime }
	get id () { return this.$state.id }
	get color () { return this.$state.color }
	get type () { return this.$state.type }

	constructor ( seriesName, seriesData, timeData ) {
		this.name = seriesName
		this.$state = new Utils.DataKeeper( {
			beginTime: 0,
			finishTime: 0,
			accuracy: 1,
			originalAccuracy: 1,
			id: seriesData.id,
			color: seriesData.color,
			type: seriesData.type
		} )

		this.$content = new Utils.DataKeeper()
		this.$setSeriesData( seriesData, timeData )
		
	}

	$setSeriesData ( seriesData, timeData ) {
		let beginTime = this.$state.beginTime = timeData.beginTime
		let finishTime = this.$state.finishTime = timeData.finishTime
		let accuracy = this.$state.accuracy = this.$state.originalAccuracy = timeData.accuracy

		let layer = []

		Utils.loop( beginTime, finishTime, accuracy, false, ( unixTime, iteration )=>{
			layer.push( ChartMath.point( unixTime, seriesData.points[ iteration ] ) )
		} )

		this.$content[ accuracy ] = layer
	}

	getLayer ( accuracy ) {
		accuracy = accuracy || this.$state.originalAccuracy
		let layer = this.$content[ accuracy ]
		return layer || null
	}

	slice ( from, to, accuracy ) {
		accuracy = accuracy || this.$state.originalAccuracy

		from -= this.$state.accuracy
		to += this.$state.accuracy

		if ( from < this.$state.beginTime ) from = this.$state.beginTime
		if ( to < this.$state.beginTime ) to = this.$state.finishTime

		from = ChartMath.nearestMult( from, this.$state.accuracy, false, true )
		to = ChartMath.nearestMult( to, this.$state.accuracy, true, true )

		from =  (from - this.$state.beginTime) / accuracy
		to =  (to - this.$state.beginTime) / accuracy

		return this.getLayer( accuracy ).slice( from, to )
	}

	getExtremum ( from, to, accuracy ) {
		let piece = this.slice( from, to, accuracy )
		let extremum = ChartMath.getExtremum(piece)
		return extremum
	}
}

export default Series