import TelechartModule from "Telechart/Utils/TelechartModule"
import Utils from "Telechart/Utils"
import DOMElementEventHandler from "Telechart/DomDriver/DOMElementEventHandler"
import Component from "Telechart/DomDriver/Component"
import Config from "Telechart/Config"
import Tweener from "Telechart/Tweener"

import Skin from "Telechart/DomDriver/Skin"

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

		let scssFilesContext = require.context("scss")

		scssFilesContext.keys().forEach( ( path )=>{
			let cssString = scssFilesContext( path )
			let name = path.replace( ".scss", "" ).replace( "./", "" )
			Config.assets.css[name] = cssString
		})

		let skinsFilesContext = require.context("skins")

		skinsFilesContext.keys().forEach( ( path )=>{
			let skinData = skinsFilesContext( path )
			let name = path.replace( ".yml", "" ).replace( "./", "" )
			Config.assets.skins[name] = new Skin( skinData )

			if ( skinData.default === true ) {
				Config.defaultSkin = skinData.name
			}
		})
	}

	constructor () {
		super()
	}

	init ( { telechart, majorPlot, panoramaPlot } ) {
		this.$temp = {}

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
			eventsList: [ "click", "drag", "zoom", "doubletap", "pan" ]
		} )

		majorPlot.on( "plot.dom.pan", this.$onMajorPlotPan.bind( this ) )
		majorPlot.on( "plot.dom.drag", this.$onMajorPlotDrag.bind( this ) )
		majorPlot.on( "plot.dom.zoom", this.$onMajorPlotZoom.bind( this ) )
		majorPlot.on( "plot.dom.doubletap", this.$onMajorPlotClick.bind( this ) )

		this.$modules.domComponent.on( "theme-switcher.click", this.$onThemeSwitcherClick.bind(this) )

		this.$modules.domComponent.addChild( "major-plot-wrapper", majorPlot.domElement )
		this.$modules.domComponent.addChild( "panorama-plot-wrapper", panoramaPlot.domElement )

		this.fitSize = this.fitSize.bind( this )

		this.applySkin()

		window.addEventListener( "resize", this.fitSize )

	}

	fitSize () {
		this.$modules.majorPlot.fitSize()
		this.$modules.panoramaPlot.fitSize()
	}

	applySkin ( skinName ) {
		skinName = skinName || Config.defaultSkin
		Config.activeSkin = skinName
		Config.assets.skins[ skinName ] && Config.assets.skins[ skinName ].apply()
	} 

	$onMajorPlotDrag ( data ) {
		let position = this.$modules.majorPlot.position
		let dragDelta = this.$modules.majorPlot.toVirtualScale( data.dragX, data.dragY )
		this.$modules.majorPlot.setPosition( position.x - dragDelta.x, position.y )
	}

	$onMajorPlotClick ( data ) {
		let virtualPosition = this.$modules.majorPlot.toVirtual( data.x, data.y )

		this.$modules.majorPlot.__addCircle( virtualPosition.x, virtualPosition.y )
		// this.$modules.majorPlot.__addText( virtualPosition.x, virtualPosition.y, Utils.generateRandomString("test", 8) )
	}

	$onMajorPlotZoom ( data ) {
		let scale = this.$modules.majorPlot.scale
		let scaleX = scale.x
		let newScaleX = scaleX * ( ( data.zoomIn ) ? ( 1/2 ) : ( 2 ) )

		this.$temp.killZoomTween && this.$temp.killZoomTween()

		this.$temp.killZoomTween = Tweener.tween( {
			duration: 100,
			fromValue: scaleX,
			toValue: newScaleX,
			ease: "linear",
			onUpdate: ( value, completed )=>{
				this.$modules.majorPlot.setScale( value, scale.y )

				if ( completed ) {
					delete this.$temp.killZoomTween
				}
			}
		} )

		
	}

	$onMajorPlotPan ( data ) {
		let scale = this.$modules.majorPlot.scale
		let scaleX = scale.x
		let newScaleX = scaleX * (data.panDelta || 1)

		this.$modules.majorPlot.setScale( newScaleX, scale.y )
	} 

	$onThemeSwitcherClick ( data ) {
		if ( Config.activeSkin == "day" ) {
			this.$modules.domComponent.ref("theme-switcher-caption").textContent = "Switch to Day Mode"
			this.applySkin( "night" )
		} else {
			this.$modules.domComponent.ref("theme-switcher-caption").textContent = "Switch to Night Mode"
			this.applySkin( "day" )
		}
	}
}

DomDriver.loadAssets()

export default DomDriver