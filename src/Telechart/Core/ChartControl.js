import TelechartModule from "Telechart/Core/TelechartModule"
import DOMComponent from "Telechart/Core/DOM/Component"

class ChartControl extends TelechartModule {
	constructor () {
		super()

		this.$modules.domComponent = new DOMComponent( {
			template: "chart-control"
		} )
	}
}

export default ChartControl