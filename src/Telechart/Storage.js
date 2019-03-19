import Series from "Telechart/Storage/Series"
import Utils from "Telechart/Utils"
import ChartMath from "Telechart/ChartMath"
import TelechartModule from "Telechart/Core/TelechartModule"

class Storage extends TelechartModule {
	static normalizeChartData  ( data ) {
		let datasetData = {}

		Utils.loopCollection( data.columns, ( rawData, index )=>{
			let seriesData = {}
			let seriesId = ( typeof rawData[0] == "string" ) ? ( rawData.shift() ) : ( index === 0 ? "x" : `y${index - 1}` )
			let seriesType = data.types[ seriesId ]
			let seriesName = data.names[ seriesId ]
			let seriesColor = data.colors[ seriesId ]

			switch ( seriesType ) {
				case "x":
					datasetData.time = this.processTimeRawData( rawData )
				break;
				default:
					datasetData.series = datasetData.series || {}
					datasetData.series[ seriesId ] = {
						id: seriesId,
						name: seriesName,
						type: seriesType,
						color: seriesColor,
						points: rawData
					}
				break;
			}
		} )

		return datasetData
	}

	static processTimeRawData ( rawData ) {
		let beginTime, finishTime, accuracy = null;

		Utils.loopCollection( rawData, ( unixTime, index )=>{
			if ( index == 0 ) {
				beginTime = unixTime
			} else if ( index == rawData.length - 1 ) {
				finishTime = unixTime
			}

			if ( accuracy === null && index > 0 ) {
				accuracy = unixTime - rawData[ index - 1 ]
			}
		} )

		return { beginTime, finishTime, accuracy }
	}

	constructor () {
		super()

		this.$state = new Utils.DataKeeper( {
			accuracy: null,
			originalAccuracy: null,
			beginTime: 0,
			finishTime: 0
		} )

		this.series = new Utils.DataKeeper()
	}

	importRawDataset ( rawDatasetData ) {
		this.importDataset( Storage.normalizeChartData( rawDatasetData ) )
	}

	importDataset ( datasetData ) {

		Utils.loopCollection( datasetData.series, ( seriesData, seriesId )=>{
			this.series[ seriesId ] = new Series( seriesId, seriesData, datasetData.time )
			this.$state.originalAccuracy = this.series[ seriesId ].originalAccuracy
			this.$state.beginTime = this.series[ seriesId ].beginTime
			this.$state.finishTime = this.series[ seriesId ].finishTime

			if ( this.$state.accuracy === null ) {
				this.$state.accuracy = this.$state.originalAccuracy
			}
		} )
	}

	getSeriesPoints ( seriesId ) {
		return this.series[ seriesId ].slice(
			this.$state.beginTime,
			this.$state.finishTime,
			this.$state.accuracy
		)
	}

	getExtremum ( from, to ) {
		let values = []

		Utils.loopCollection( this.series, ( series, seriesId )=>{
			if ( !series.visible ) {
				return
			}

 			let extremum = series.getExtremum( from, to, this.$state.accuracy )
			values.push( extremum.min, extremum.max )
		} )

		let extremum = ChartMath.getExtremum( values )

		return extremum
	}

	getValueAt ( time, accuracy ) {
		let values = {}

		Utils.loopCollection( this.series, ( series, seriesId )=>{
			values[ seriesId ] = series.getValueAt( time, this.$state.accuracy )
		} )

		return values
	}

	setSeriesVisibility ( seriesId, isVisible ) {
		this.series[ seriesId ].visible = isVisible
		this.emit( "series.visibility.changed", this.series[ seriesId ] )
	}
}

export default Storage