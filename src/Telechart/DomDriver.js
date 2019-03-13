import TelechartModule from "Telechart/Utils/TelechartModule"
import Utils from "Telechart/Utils"
import DOMElementEventHandler from "Telechart/DomDriver/DOMElementEventHandler"
import Component from "Telechart/DomDriver/Component"
import Config from "Telechart/Config"

class DomDriver extends TelechartModule {
	static Component = Component;

	static assets = {
		html: {},
		css: {}
	};

	static loadAssets () {
		let htmlFilesContext = require.context("txt!html")

		htmlFilesContext.keys().forEach( ( path )=>{
			let htmlString = htmlFilesContext( path )
			let name = path.replace( ".html", "" ).replace( "./", "" )
			Config.assets.html[name] = htmlString
		})

		let cssFilesContext = require.context("txt!css")

		cssFilesContext.keys().forEach( ( path )=>{
			let cssString = cssFilesContext( path )
			let name = path.replace( ".css", "" ).replace( "./", "" )
			Config.assets.css[name] = cssString
		})
	}

	constructor () {
		super()
	}

	init ( { telechart, majorPlot, panoramaPlot } ) {
		this.$modules = {
			majorPlot,
			panoramaPlot,
			domComponent: new Component( {
				template: "telechart"
			} )
		}

		this.$dom = {
			rootElement: this.$modules.domComponent.domElement
		}

		this.$modules.majorPlotDOMEventHandler = new DOMElementEventHandler( {
			domElement: majorPlot.domElement,
			eventsList: ["click", "drag", "zoom"]
		} )

		majorPlot.on( "plot.dom.drag", this.$onMajorPlotDrag.bind( this ) )
		majorPlot.on( "plot.dom.zoom", this.$onMajorPlotZoom.bind( this ) )

		this.$modules.domComponent.addChild( "major-plot-wrapper", majorPlot.domElement )
		this.$modules.domComponent.addChild( "panorama-plot-wrapper", panoramaPlot.domElement )

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

DomDriver.loadAssets()

export default DomDriver