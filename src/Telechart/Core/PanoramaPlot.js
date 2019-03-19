import Plot from "Telechart/Plot"
import Component from "Telechart/Core/DOM/Component"
import RenderingEngine from "Telechart/RenderingEngine"
import ChartMath from "Telechart/ChartMath"

class PanoramaPlot extends Plot {
	constructor ( params ) {
		super( params )

		this.$state.beginTime = 0
		this.$state.frameViewport = ChartMath.rect( 0, 0, 0, 0 )

		let frameControlComponent = this.$modules.frameControlComponent = new Component( {
			template: "frame-control"
		} )

		this.$modules.domComponent.addChild( "dom-layer", this.$modules.frameControlComponent.domElement )

		frameControlComponent.on( "frame-control.left-plane.drag", this.$onFrameControlLeftPlaneDrag.bind(this) )
		frameControlComponent.on( "frame-control.right-plane.drag", this.$onFrameControlRightPlaneDrag.bind(this) )
		frameControlComponent.on( "frame-control.frame.drag", this.$onFrameControlFrameDrag.bind(this) )

		this.$modules.frameControlsRenderingObject = new RenderingEngine.DOMElement( {
			domElement: frameControlComponent.ref( "frame-control.frame" ),
			applyPosX: true,
			applyPosY: false,
			applySizeX: true,
			applySizeY: false
		} )

		this.$modules.renderingEngine.addChild( this.$modules.frameControlsRenderingObject )
	}

	setFramePosition ( x ) {
		let frameControlsRO = this.$modules.frameControlsRenderingObject
		let frameViewport = this.$state.frameViewport
		let beginTime = this.$state.beginTime
		let finishTime = this.$state.finishTime

		if ( x < beginTime ) x = beginTime
		if ( x + frameViewport.w > finishTime ) x = finishTime - frameViewport.w

		frameViewport.x = x
		frameControlsRO.position.x = x
		frameControlsRO.render()
		this.emit( "frame.viewport.changed", frameViewport )
	}

	setFrameSize ( w ) {
		let frameControlsRO = this.$modules.frameControlsRenderingObject
		let frameViewport = this.$state.frameViewport
		let beginTime = this.$state.beginTime
		let finishTime = this.$state.finishTime
		let accuracy = this.$state.accuracy

		if ( w < accuracy ) w = accuracy
		if ( frameViewport.x + w > this.$state.finishTime ) w = this.$state.finishTime - frameViewport.x

		frameViewport.w = w
		frameControlsRO.scale.x = w
		frameControlsRO.render()
		this.emit( "frame.viewport.changed", frameViewport )
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