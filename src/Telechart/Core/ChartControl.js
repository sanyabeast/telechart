import TelechartModule from "Telechart/Core/TelechartModule"
import DOMComponent from "Telechart/Core/DOM/Component"
import Utils from "Telechart/Utils"

class ChartControl extends TelechartModule {
	constructor () {
		super()

		this.$temp.seriesButtons = new Utils.DataKeeper()

		this.$modules.domComponent = new DOMComponent( {
			template: "chart-control"
		} )
	}

	addSeriesButton ( series ) {
		let seriesId = series.id

		let seriesButton = new DOMComponent( {
			template: "chart-control-series-button"
		} )

		this.$modules.domComponent.addChild( "series-buttons", seriesButton.domElement )

		this.$temp.seriesButtons[ seriesId ] = seriesButton

		Utils.assignValues( seriesButton.ref( "checkbox-wrapper" ).style, {
			borderColor: series.color
		} )

		seriesButton.ref( "caption" ).textContent = series.name

		seriesButton.on( "series-button.click", ()=>{
			this.emit( "toggle.series.visibility", series )
		} )
	}

	removeSeriesButton ( series ) {

	}  

	setSeriesVisibility ( seriesId, isVisible ) {
		if ( isVisible ) {
			this.$temp.seriesButtons[ seriesId ].classList.remove( "disabled" )
		} else {
			this.$temp.seriesButtons[ seriesId ].classList.add( "disabled" )
		}
	} 
}

export default ChartControl