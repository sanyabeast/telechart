import Plot from "Telechart/Plot"
import Component from "Telechart/DomDriver/Component"
import RenderingEngine from "Telechart/RenderingEngine"

class PanoramaPlot extends Plot {
	constructor ( params ) {
		super( params )

		this.$state.beginTime = 0

		this.$modules.frameControlComponent = new Component( {
			template: "frame-control"
		} )

		this.$modules.domComponent.addChild( "dom-layer", this.$modules.frameControlComponent.domElement )

		this.$modules.frameControlComponent.on( "frame-control.left-plane.drag", this.$onFrameControlLeftPlaneDrag.bind(this) )
		this.$modules.frameControlComponent.on( "frame-control.right-plane.drag", this.$onFrameControlRightPlaneDrag.bind(this) )
		this.$modules.frameControlComponent.on( "frame-control.frame.drag", this.$onFrameControlFrameDrag.bind(this) )

		this.$modules.frameControlsRenderingObject = new RenderingEngine.DOMElement( {
			domElement: this.$modules.frameControlComponent.ref( "frame-control.frame" ),
			applyPosX: true,
			applyPosY: false,
			applyScaleX: true,
			applyScaleY: false
		} )

		this.$modules.renderingEngine.addChild( this.$modules.frameControlsRenderingObject )
	}

	$onFrameControlLeftPlaneDrag ( data ) {
		console.log(data.dragX)

	}

	$onFrameControlRightPlaneDrag ( data ) {
		console.log(data)
	}

	$onFrameControlFrameDrag ( data ) {
		let delta = this.$modules.renderingEngine.toVirtualScale( data.dragX, 0 )
		this.$modules.frameControlsRenderingObject.position.x += delta.x
		this.$modules.frameControlsRenderingObject.render()
	}

	addSeries ( seriesData ) {
		super.addSeries( seriesData )
		this.$state.beginTime = seriesData.series.beginTime
		this.$modules.frameControlsRenderingObject.position.x = seriesData.series.beginTime
	}
}

export default PanoramaPlot