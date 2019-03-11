import RenderingEngine from "Telechart/RenderingEngine"
import Utils from "Telechart/Utils"
import TelechartModule from "Telechart/Utils/TelechartModule"

import plot_html from "txt!html/plot.html"

class Plot extends TelechartModule {
	get domElement () { return this.$dom.rootElement }

	constructor () {
		super()

		this.$dom = {
			rootElement: Utils.parseHTML( plot_html )
		}

		this.$modules = {
			renderingEngine: new RenderingEngine()
		}

		this.$dom.rootElement.querySelector( ".canvas-wrapper" ).appendChild( this.$modules.renderingEngine.domElement )
	}

	fitSize () {
		this.$modules.renderingEngine.fitSize()
	}
}

export default Plot