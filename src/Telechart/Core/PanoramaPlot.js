/**
 * @author sanyabeast | github.com/sanyabeast | a.gvrnsk@gmail.com | telegram:sanyabeats
 */

 
import Plot from "Telechart/Plot"
import Component from "Telechart/Core/DOM/Component"
import GLEngine from "Telechart/GLEngine"
import ChartMath from "Telechart/ChartMath"
import Utils from "Telechart/Utils"

class PanoramaPlot extends Plot {
	constructor ( params ) {
		super( params )

		this.$state.beginTime = 0
		this.$state.frameViewportRect = ChartMath.rect( 0, 0, 0, 0 )

		let frameControlComponent = this.$modules.frameControlComponent = new Component( {
			template: "frame-control"
		} )

		this.$modules.domComponent.addChild( "dom-layer", this.$modules.frameControlComponent.domElement )

		frameControlComponent.on( "frame-control.filler.left.drag", this.$onFrameControlLeftFillerDrag.bind(this) )
		frameControlComponent.on( "frame-control.filler.right.drag", this.$onFrameControlRightFillerDrag.bind(this) )
		frameControlComponent.on( "frame-control.frame.drag", this.$onFrameControlFrameDrag.bind(this) )

		this.$modules.frameControlsRenderingObject = new GLEngine.DOMElement( {
			domElement: frameControlComponent.ref( "frame-control.frame" ),
			applyPosX: true,
			applyPosY: false,
			applySizeX: true,
			applySizeY: false
		} )

		this.$modules.frameControlsLeftFillerRenderingObject = new GLEngine.DOMElement( {
			domElement: frameControlComponent.ref( "frame-control.filler.left" ),
			applyPosX: false,
			applyPosY: false,
			applySizeX: true,
			applySizeY: false
		} )

		this.$modules.frameControlsRightFillerRenderingObject = new GLEngine.DOMElement( {
			domElement: frameControlComponent.ref( "frame-control.filler.right" ),
			applyPosX: false,
			applyPosY: false,
			applySizeX: true,
			applySizeY: false
		} )

		this.$modules.renderingEngine.addChild( this.$modules.frameControlsRenderingObject )
		this.$modules.renderingEngine.addChild( this.$modules.frameControlsLeftFillerRenderingObject )
		this.$modules.renderingEngine.addChild( this.$modules.frameControlsRightFillerRenderingObject )

		Utils.proxyProps( this, this.$state, [
			"frameViewportRect"
		] )
	}

	setFramePosition ( x ) {
		let frameControlsRO = this.$modules.frameControlsRenderingObject
		let frameViewport = this.$state.frameViewportRect
		let beginTime = this.$state.beginTime
		let finishTime = this.$state.finishTime

		if ( x < beginTime ) x = beginTime
		if ( x + frameViewport.w > finishTime ) x = finishTime - frameViewport.w

		frameViewport.x = x
		frameControlsRO.position.x = x
		frameControlsRO.render()
		this.$updateFillers()
		this.emit( "frame.viewport.changed", frameViewport )
	}

	setFrameSize ( w ) {
		let frameControlsRO = this.$modules.frameControlsRenderingObject

		let frameViewport = this.$state.frameViewportRect
		let beginTime = this.$state.beginTime
		let finishTime = this.$state.finishTime
		let accuracy = this.$state.accuracy

		if ( w < accuracy ) w = accuracy
		if ( frameViewport.x + w > this.$state.finishTime ) w = this.$state.finishTime - frameViewport.x

		frameViewport.w = w
		frameControlsRO.size.x = w
		frameControlsRO.render()

		this.$updateFillers()

		this.emit( "frame.viewport.changed", frameViewport )
	}

	$updateFillers () {
		let frameControlsLeftFillerRO = this.$modules.frameControlsLeftFillerRenderingObject
		let frameControlsRightFillerRO = this.$modules.frameControlsRightFillerRenderingObject

		let frameViewport = this.$state.frameViewportRect
		let beginTime = this.$state.beginTime
		let finishTime = this.$state.finishTime
		let accuracy = this.$state.accuracy

		frameControlsLeftFillerRO.size.x = frameViewport.x - beginTime
		frameControlsRightFillerRO.size.x = finishTime - ( frameViewport.x + frameViewport.w )

		frameControlsLeftFillerRO.render()
		frameControlsRightFillerRO.render()
	}

	$onFrameControlLeftFillerDrag ( data ) {
		let delta = this.$modules.renderingEngine.toVirtualScale( data.dragX, 0 )
		let newPosition = ( this.$state.frameViewportRect.x + delta.x )
		let newFrameSize = ( this.$state.frameViewportRect.w - delta.x )

		if ( newFrameSize <= this.$state.accuracy ) {
			newFrameSize = this.$state.accuracy
			newPosition -= delta.x
		}

		if ( newPosition <= this.$state.beginTime ) {
			newPosition = this.$state.beginTime
			newFrameSize += delta.x
		}


		this.setFramePosition( newPosition )
		this.setFrameSize( newFrameSize )
	}

	$onFrameControlRightFillerDrag ( data ) {
		let delta = this.$modules.renderingEngine.toVirtualScale( data.dragX, 0 )

		this.setFrameSize( this.$state.frameViewportRect.w + delta.x )
	}

	$onFrameControlFrameDrag ( data ) {
		let delta = this.$modules.renderingEngine.toVirtualScale( data.dragX, 0 )

		this.setFramePosition( this.$state.frameViewportRect.x + delta.x )
	}

	addSeries ( seriesData ) {
		super.addSeries( seriesData )

		this.setFrameSize( ( seriesData.series.finishTime - seriesData.series.beginTime ) / 5 )
		this.setFramePosition ( seriesData.series.finishTime )
	}

	
}

export default PanoramaPlot