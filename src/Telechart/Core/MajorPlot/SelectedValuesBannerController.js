import Plot from "Telechart/Plot"
import Utils from "Telechart/Utils"
import DOMComponent from "Telechart/Core/DOM/Component"
import Config from "Telechart/Config"
import ChartMath from "Telechart/ChartMath"
import Tweener from "Telechart/Tweener"
import TelechartModule from "Telechart/Core/TelechartModule"
import GLEngine from "Telechart/GLEngine"

class SelectedValuesBannerController extends TelechartModule {
	get renderingObject () { return this.$modules.renderingObject }

	constructor () {
		super()

		this.$state.series = new Utils.DataKeeper()
		this.$state.seriesValuesContainers = new Utils.DataKeeper()

		this.$modules.setMultiple( {
			domComponent: new DOMComponent( {
				template: "selected-values-banner"
			} )
		} )

		this.$modules.renderingObject = new GLEngine.DOMElement( {
			domElement: this.$modules.domComponent.domElement,
			applyScaleY: false,
			applyScaleX: false,
			applyPosY: true,
			applyPosX: true,
		} )
	}

	setPosition ( x, y ) {

		this.renderingObject.position.x = x
		this.renderingObject.position.y = y
	}

	updateSeriesValuesVisibility () {
	}

	setSeries ( seriesData ) {
		this.$state.series[ seriesData.series.id ] = seriesData
		this.$addSeriesValueContainer( seriesData )
	}

	setSeriesValues ( values ) {
		
		let x = 0
		let y = 0
		let dateSet = false


		Utils.loopCollection( values, ( point, seriesId )=>{

			x = point.x

			if ( !dateSet ) {
				this.$modules.domComponent.ref( "date-value" ).textContent = Utils.formatDate( point.x, "${weekdayName}, ${monthName} ${date}" )
			}

			if ( point.y > y ) {
				y = point.y
			}

			let valueContainer = this.$state.seriesValuesContainers[ seriesId ]
			valueContainer.ref( "value" ).textContent = point.y | 0

		} )

		this.setPosition( x, y )

	}

	$addSeriesValueContainer ( seriesData ) {
		let valueContainer = new DOMComponent( {
			"template": "selected-values-banner-value"
		} )

		valueContainer.ref( "caption" ).textContent = seriesData.series.name

		Utils.assignValues( valueContainer.ref( "caption" ).style, {
			color: seriesData.series.color
		} )

		Utils.assignValues( valueContainer.ref( "value" ).style, {
			color: seriesData.series.color
		} )

		this.$modules.domComponent.addChild( "series-values-wrapper", valueContainer.domElement )

		this.$state.seriesValuesContainers[ seriesData.series.id ] = valueContainer
	}
}

export default SelectedValuesBannerController