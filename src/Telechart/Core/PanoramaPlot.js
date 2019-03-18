import Plot from "Telechart/Plot"
import Component from "Telechart/Core/DOM/Component"
import RenderingEngine from "Telechart/RenderingEngine"
import ChartMath from "Telechart/ChartMath"

class PanoramaPlot extends Plot {
	constructor ( params ) {
		super( params )

		this.$state.beginTime = 0
		this.$state.frameViewport = ChartMath.rect( 0, 0, 0, 0 )

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

	setFramePosition ( x ) {
		if ( x < this.$state.beginTime ) x = this.$state.beginTime
		if ( x + this.$state.frameViewport.w > this.$state.finishTime ) x = this.$state.finishTime - this.$state.frameViewport.w

		this.$state.frameViewport.x = x
		this.$modules.frameControlsRenderingObject.position.x = x
		this.$modules.frameControlsRenderingObject.render()
		this.emit( "frame.viewport.changed", this.$state.frameViewport )
	}

	setFrameSize ( w ) {
		if ( w < this.$state.accuracy ) w = this.$state.accuracy
		if ( this.$state.frameViewport.x + w > this.$state.finishTime ) w = this.$state.finishTime - this.$state.frameViewport.x

		this.$state.frameViewport.w = w
		this.$modules.frameControlsRenderingObject.scale.x = w
		this.$modules.frameControlsRenderingObject.render()
		this.emit( "frame.viewport.changed", this.$state.frameViewport )
	}

	$onFrameControlLeftPlaneDrag ( data ) {
		let delta = this.$modules.renderingEngine.toVirtualScale( data.dragX, 0 )
		this.setFramePosition( this.$state.frameViewport.x + delta.x )
		this.setFrameSize( this.$state.frameViewport.w - ( delta.x ) )
	}

	$onFrameControlRightPlaneDrag ( data ) {
		let delta = this.$modules.renderingEngine.toVirtualScale( data.dragX, 0 )
		this.setFrameSize( this.$state.frameViewport.w + delta.x )
	}

	$onFrameControlFrameDrag ( data ) {
		let delta = this.$modules.renderingEngine.toVirtualScale( data.dragX, 0 )
		this.setFramePosition( this.$state.frameViewport.x + delta.x )
	}

	addSeries ( seriesData ) {
		super.addSeries( seriesData )
		this.$state.beginTime = seriesData.series.beginTime
		this.$state.finishTime = seriesData.series.finishTime
		this.$state.accuracy = seriesData.series.accuracy

		this.setFrameSize( ( seriesData.series.finishTime - seriesData.series.beginTime ) / 5 )
		this.setFramePosition ( seriesData.series.finishTime )
	}
}

export default PanoramaPlot