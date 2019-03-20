import Utils from "Telechart/Utils"
import ChartMath from "Telechart/ChartMath"

class Series {
	// get originalAccuracy 						() { return this.$state.originalAccuracy }
	// get accuracy 						() { return this.$state.accuracy }
	// get beginTime 						() { return this.$state.beginTime }
	// get finishTime 						() { return this.$state.finishTime }
	// get id 						() { return this.$state.id }
	// get color 						() { return this.$state.color }
	// get type 						() { return this.$state.type }
	// get visible 						() { return this.$state.visible }

	constructor ( seriesName, seriesData, timeData ) {
		this.name = seriesName
		this.$state = new Utils.DataKeeper( {
			beginTime: 0,
			finishTime: 0,
			accuracy: 1,
			originalAccuracy: 1,
			id: seriesData.id,
			color: seriesData.color,
			type: seriesData.type,
			visible: true
		} )

		Utils.proxyProps( this, this.$state, [
			"originalAccuracy", 
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
		let accuracy = this.$state.accuracy = this.$state.originalAccuracy = timeData.accuracy

		let layer = []

		Utils.loop( beginTime, finishTime, accuracy, false, ( unixTime, iteration )=>{
			layer.push( ChartMath.point( unixTime, seriesData.points[ iteration ] ) )
		} )

		this.$content[ accuracy ] = layer
		this.$content[ accuracy * 2 ] = this.downsampleLayer( layer, accuracy * 2 )
		this.$content[ accuracy * 3 ] = this.downsampleLayer( layer, accuracy * 3 )
		this.$content[ accuracy * 4 ] = this.downsampleLayer( layer, accuracy * 4 )
	}

	getLayer ( accuracy ) {
		accuracy = accuracy || this.$state.originalAccuracy
		let layer = this.$content[ accuracy ]

		if ( !layer ) {
			layer = this.$content[ accuracy ] = this.downsampleLayer( this.$content[ this.$state.originalAccuracy ], accuracy )
		}

		return layer || null
	}

	slice ( from, to, accuracy ) {
		accuracy = accuracy || this.$state.originalAccuracy

		from -= this.$state.accuracy
		to += this.$state.accuracy

		if ( from < this.$state.beginTime ) from = this.$state.beginTime
		if ( to > this.$state.finishTime ) to = this.$state.finishTime

		
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

	getValueAt ( position, accuracy ) {
		let layer = this.$content[ accuracy ]

		if ( position < this.$state.beginTime ) position = this.$state.beginTime
		if ( position > this.$state.finishTime ) position = this.$state.finishTime

		let from = position

		from = ChartMath.nearestMult( position, accuracy, false, true )

		let to = from + accuracy
		let step = ChartMath.getStep( from, to, position )

		from =  (from - this.$state.beginTime) / accuracy
		to =  (to - this.$state.beginTime) / accuracy

		let intermediateValue = ChartMath.smoothstep( layer[from], layer[to], step )

		// console.log(intermediateValue, position, from)

		return ChartMath.point( position, intermediateValue )
	}

	downsampleLayer ( sourceLayer, newAccuracy ) {

		let beginTime = this.$state.beginTime
		let finishTime = this.$state.finishTime
		let originalAccuracy = this.$state.originalAccuracy

		let layer = []

		Utils.loop( beginTime, finishTime, newAccuracy, false, ( unixTime, iteration )=>{
			let point = this.getValueAt( unixTime, this.originalAccuracy )
			layer.push( point )
		} )

		return layer
	} 
}

export default Series