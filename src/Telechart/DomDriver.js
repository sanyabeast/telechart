import TelechartModule from "Telechart/Utils/TelechartModule"
import Utils from "Telechart/Utils"
import DOMElementEventHandler from "Telechart/DomDriver/DOMElementEventHandler"

import modifiers_css from "txt!css/modifiers.css"
import telechart_css from "txt!css/telechart.css"
import telechart_html from "txt!html/telechart.html"

class DomDriver extends TelechartModule {
	get domElement () { return this.$dom.rootElement }

	constructor () {
		super()
	}

	init ( { telechart, majorPlot, panoramaPlot } ) {
		Utils.injectCSS( "telechart-modifiers", modifiers_css )
		Utils.injectCSS( "telechart-app", telechart_css )

		this.$modules = {
			majorPlot,
			panoramaPlot 
		}

		this.$dom = {
			rootElement: Utils.parseHTML( telechart_html )
		}

		this.$modules.majorPlotDOMEventHandler = new DOMElementEventHandler( {
			domElement: majorPlot.domElement,
			eventsList: ["click", "drag", "zoom"]
		} )

		this.$modules.majorPlotDOMEventHandler.on( "drag", this.$onMajorPlotDrag.bind( this ) )
		this.$modules.majorPlotDOMEventHandler.on( "zoom", this.$onMajorPlotZoom.bind( this ) )

		this.$dom.rootElement.querySelector( ".major-plot-wrapper" ).appendChild(majorPlot.domElement)
		this.$dom.rootElement.querySelector( ".panorama-plot-wrapper" ).appendChild(panoramaPlot.domElement)

		this.fitSize = this.fitSize.bind( this )

		window.addEventListener( "resize", this.fitSize )

	}

	fitSize () {
		this.$modules.majorPlot.fitSize()
		this.$modules.panoramaPlot.fitSize()
	}

	$onMajorPlotDrag ( data ) {
		let position = this.$modules.majorPlot.position
		let dragDelta = this.$modules.majorPlot.toVirtualScale( data.dragX, data.dragY )
		this.$modules.majorPlot.setPosition( position.x - dragDelta.x, position.y )
	}

	$onMajorPlotZoom ( data ) {
		let scale = this.$modules.majorPlot.scale
		let scaleX = scale.x * ( ( data.zoomIn ) ? (0.5) : (2.0) )
		this.$modules.majorPlot.setScale( scaleX, scale.y )
	}
}

export default DomDriver