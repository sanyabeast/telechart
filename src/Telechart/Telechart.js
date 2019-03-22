/* All code written by @sanyabeast from scratch. */
import Utils from "Telechart/Utils"
import MainLoop from "Telechart/MainLoop"
import TelechartModule from "Telechart/Core/TelechartModule"
import Config from "Telechart/Config"

import Skin from "Telechart/Core/DOM/Skin"
import DOMComponent from "Telechart/Core/DOM/Component"

import MajorPlot from "Telechart/Core/MajorPlot"
import PanoramaPlot from "Telechart/Core/PanoramaPlot"
import ChartControl from "Telechart/Core/ChartControl"
import Storage from "Telechart/Storage"

/** 
 * @class
 * Telechart. Root class.
 * @property {window.Node} domElement - root DOM element
 */
class Telechart extends TelechartModule {
	Config = Config

	/* static */
	static processAsset ( context, assetName, extension, processor ) {
		context.keys().forEach( ( path )=>{
			let data = context( path )
			let name = path.replace( `.${extension}`, "" ).replace( "./", "" )
			Config.assets[ assetName ][ name ] = ( processor ? processor( data ) : data )
		})
	}

	static loadAssets () {
		this.processAsset( require.context("txt!html"), "html", "html" )
		this.processAsset( require.context("scss"), "css", "scss" )
		this.processAsset( require.context("txt!shaders"), "shaders", "glsl" )
		this.processAsset( require.context("skins"), "skins", "yml", ( skinData )=> {
			if ( skinData.default ) Config.defaultSkin = skinData.name
			return new Skin( skinData )
		}  )
	}

	/** 
	 * @constructor
	 */
	constructor () {
		super()

		this.$state = new Utils.DataKeeper( {
			renderingPaused: true
		} )

		this.$modules.set( {
			chartControl: new ChartControl(),
			domComponent: new DOMComponent( {
				template: "telechart"
			} )
		} )

		this.$modules.set( {
			storage: new Storage(),
			majorPlot: new MajorPlot(),
			panoramaPlot: new PanoramaPlot(),
		}  )

		this.$setupDOM()
		this.$setupEvents()
		this.startRendering()
	}

	/**
	 * @param {Object} chartData - input data
	 *
	 */
	update ( chartData ) {
		Utils.loopCollection( chartData[ 4 ].columns[0], ( value, index )=>{
			chartData[ 4 ].columns[0][index] = index;
		} )

		// Utils.loopCollection( chartData[ 0 ].columns[1], ( value, index )=>{
		// 	chartData[ 0 ].columns[1][index] = (Math.random() * 10000000) + 10;

		// } )

		// Utils.loopCollection( chartData[ 0 ].columns[2], ( value, index )=>{
		// 	chartData[ 0 ].columns[2][index] = ( index % 2 == 0 ) ? 1 : 0

		// 	if ( index % 15 == 0 ) chartData[ 0 ].columns[2][index] = 3
		// 	if ( index % 30 == 0 ) chartData[ 0 ].columns[2][index] = 5
		// } )

		console.log( chartData[ 4 ] )

		this.$modules.storage.importRawDataset( chartData[ 4 ] )

		Utils.loopCollection( this.$modules.storage.series, ( series, seriesName )=>{
			let points = this.$modules.storage.getSeriesPoints( seriesName )

			this.$modules.majorPlot.addSeries( {
				points: points,
				series: series,
				extremum: this.$modules.storage.getExtremum( series.beginTime, series.finishTime, series.accuracy ),
			} )

			this.$modules.panoramaPlot.addSeries( {
				points: points,
				series: series,
				extremum: this.$modules.storage.getExtremum( series.beginTime, series.finishTime, series.accuracy ),
			} )

		} )
	}

	setSkin ( skinName ) {
		skinName = skinName || Config.defaultSkin
		Config.activeSkin = skinName
		Config.assets.skins[ skinName ] && Config.assets.skins[ skinName ].apply()
	}

	setParentElement( parentElement ) {
		parentElement.appendChild( this.domElement )
	}

	startRendering () {
		if ( !this.$state.renderingPaused ) return
		this.$state.set( "renderingPaused", false )

		this.$modules.majorPlot.startRendering()
		this.$modules.panoramaPlot.startRendering()
	}

	stopRendering () {
		if ( this.$state.renderingPaused ) return
		this.$state.set( "renderingPaused", true )

		this.$modules.majorPlot.stopRendering()
		this.$modules.panoramaPlot.stopRendering()
	}

	/* private */
	$setupDOM () {
		this.$modules.domComponent.addChild( "chart-controls-wrapper", this.$modules.chartControl.domElement )
		this.$modules.domComponent.addChild( "major-plot-wrapper", this.$modules.majorPlot.domElement )
		this.$modules.domComponent.addChild( "panorama-plot-wrapper", this.$modules.panoramaPlot.domElement )
		this.setSkin()
	}

	$setupEvents () {
		this.$modules.domComponent.on( "theme-switcher.click", this.$onThemeSwitcherClick.bind(this) )

		this.$modules.panoramaPlot.on( "frame.viewport.changed", ( frameRect )=>{
			
			let majorPlotExtremum = this.$modules.storage.getExtremum( frameRect.x, frameRect.x + frameRect.w )

			this.$modules.majorPlot.setViewport(
				frameRect.x,
				this.$modules.majorPlot.viewport.y,
				frameRect.w,
				this.$modules.majorPlot.viewport.h
			)

			this.$modules.majorPlot.setExtremum( majorPlotExtremum, true )

		} )

		this.$modules.majorPlot.on( "user.position.select", ( position )=>{
			let values = this.$modules.storage.getValueAt( position.x )
			this.$modules.majorPlot.setSelectedPositionValues( values )
		} )

		this.$modules.storage.on( "series.visibility.changed", ( series )=>{
			let panoramaPlotFrameRect = this.$modules.panoramaPlot.frameViewportRect
			let majorPlotExtremum = this.$modules.storage.getExtremum( panoramaPlotFrameRect.x, panoramaPlotFrameRect.x + panoramaPlotFrameRect.w )
			let panoramaPlotExtremum = this.$modules.storage.getExtremum( series.beginTime, series.finishTime, series.accuracy )

			this.$modules.chartControl.setSeriesVisibility( series.id, series.visible )
			this.$modules.majorPlot.setSeriesVisibility( series.id, series.visible )
			this.$modules.panoramaPlot.setSeriesVisibility( series.id, series.visible )

			this.$modules.panoramaPlot.setExtremum( 
				panoramaPlotExtremum,
				true
			)

			this.$modules.majorPlot.setExtremum( majorPlotExtremum, true )
		} )

		this.$modules.storage.on( "series.added", ( series )=>{
			this.$modules.chartControl.addSeriesButton( series )
		} )

		this.$modules.chartControl.on( "toggle.series.visibility", ( series )=>{
			this.$modules.storage.toggleSeriesVisibility( series.id )
		} )
	}

	/* event callbacks */
	$onThemeSwitcherClick ( data ) {
		if ( Config.activeSkin == "day" ) {
			this.$modules.domComponent.ref("theme-switcher-caption").textContent = "Switch to Day Mode"
			this.setSkin( "night" )
		} else {
			this.$modules.domComponent.ref("theme-switcher-caption").textContent = "Switch to Night Mode"
			this.setSkin( "day" )
		}
	}
}

Telechart.loadAssets()
MainLoop.start()

export default Telechart