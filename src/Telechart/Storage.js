import Dataset from "Telechart/Storage/Dataset"
import Series from "Telechart/Storage/Series"
import Utils from "Telechart/Utils"
import ChartMath from "Telechart/Utils/ChartMath"

class Storage {
	static Dataset = Dataset
	static Series = Series

	constructor () {
		this.$content = new Utils.DataKeeper()
	}

	importDataset ( datasetData ) {
		Utils.loopCollection( datasetData.series, ( seriesData, seriesName )=>{
			this.$content[ seriesName ] = new Series( seriesName, seriesData, datasetData.time )
		} )

		console.log( datasetData )
	}

	getExtremum ( from, to, accuracy ) {
		let values = []

		Utils.loopCollection( this.$content, ( series, seriesName )=>{
			let extremum = series.getExtremum( from, to, accuracy )
			values.push( extremum.min, extremum.max )
		} )

		return ChartMath.getExtremum( values )
	}
}

export default Storage