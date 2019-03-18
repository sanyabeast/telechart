import Dataset from "Telechart/Storage/Dataset"
import Series from "Telechart/Storage/Series"
import Utils from "Telechart/Utils"
import ChartMath from "Telechart/ChartMath"

class Storage {
	static Dataset = Dataset
	static Series = Series

	constructor () {
		this.$state = new Utils.DataKeeper( {
			accuracy: null,
			originalAccuracy: null,
			beginTime: 0,
			finishTime: 0
		} )

		this.series = new Utils.DataKeeper()
	}

	importDataset ( datasetData ) {
		console.log( datasetData )

		Utils.loopCollection( datasetData.series, ( seriesData, seriesName )=>{
			this.series[ seriesName ] = new Series( seriesName, seriesData, datasetData.time )
			this.$state.originalAccuracy = this.series[ seriesName ].originalAccuracy
			this.$state.beginTime = this.series[ seriesName ].beginTime
			this.$state.finishTime = this.series[ seriesName ].finishTime

			if ( this.$state.accuracy === null ) {
				this.$state.accuracy = this.$state.originalAccuracy
			}
		} )
	}

	getSeriesPoints ( seriesName ) {
		return this.series[ seriesName ].slice(
			this.$state.beginTime,
			this.$state.finishTime,
			this.$state.accuracy
		)
	}

	getExtremum ( from, to, accuracy ) {
		let values = []

		Utils.loopCollection( this.series, ( series, seriesName )=>{
			let extremum = series.getExtremum( from, to, accuracy )
			values.push( extremum.min, extremum.max )
		} )

		return ChartMath.getExtremum( values )
	}
}

export default Storage