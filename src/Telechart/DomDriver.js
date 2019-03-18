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