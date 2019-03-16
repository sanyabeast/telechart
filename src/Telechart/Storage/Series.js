import Utils from "Telechart/Utils"
import ChartMath from "Telechart/Utils/ChartMath"

class Series {
	constructor ( seriesName, seriesData, timeData ) {
		this.name = seriesName
		this.$state = new Utils.DataKeeper( {
			beginTime: 0,
			finishTime: 0,
			accuracy: 1,
			originalAccuracy: 1
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