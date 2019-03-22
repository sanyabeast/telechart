import Plot from "Telechart/Plot"
import Utils from "Telechart/Utils"
import RenderingEngine from "Telechart/GLEngine"
import DOMComponent from "Telechart/Core/DOM/Component"
import Config from "Telechart/Config"
import ChartMath from "Telechart/ChartMath"
import Tweener from "Telechart/Tweener"

class MajorPlot extends Plot {
	constructor ( params ) {
		super( params )

		this.$temp.circlesRenderingObjects = {}
		// this.$temp.prevSelectedPosition = ChartMath.point()

		this.$modules.domComponent.on( "dom.drag", this.$onUserDrag.bind(this) )
		this.$modules.domComponent.on( "dom.click", this.$onUserClick.bind(this) )
		this.$modules.domComponent.on( "dom.pan", this.$onUserPan.bind(this) )

	}

	$onUserDrag ( eventData ) {
		let position = this.$modules.renderingEngine.toVirtual( eventData.x, eventData.y )
		console.log( position )
		this.emit( "user.position.select", position )
	}

	$onUserClick ( eventData ) {
		let position = this.$modules.renderingEngine.toVirtual( eventData.x, eventData.y )
		this.emit( "user.position.select", position )
	}

	$onUserPan ( eventData ) {
		
		if ( eventData.panDelta > 0 ) {
			let scale = this.$modules.renderingEngine.scale
			this.$modules.renderingEngine.setScale( scale.x * eventData.panDelta, scale.y )
		}

		// console.log( eventData.panDelta )
	}

	setSelectedPositionValues ( values ) {

		Utils.loopCollection( this.$temp.circlesRenderingObjects, ( circleObject, name )=>{
			circleObject.visible = false
		} )


		Utils.loopCollection( values, ( seriesValue, seriesName )=>{
			let circleRenderingObject = this.$temp.circlesRenderingObjects[ seriesName ]

			if ( !circleRenderingObject ) {
				let circleComponent = new DOMComponent( {
					template: "selected-position-circle"
				} )

				circleRenderingObject = new RenderingEngine.DOMElement( {
					domElement: circleComponent.domElement,
					domComponent: circleComponent,
					applyScaleY: false,
					applyScaleX: false,
					applyPosY: true,
					applyPosX: true,
					test: true,
				} )

				circleRenderingObject.setStyles( {
					borderColor: this.$state.series[ seriesName ].series.color,
					width: `${Config.values.plotSelectedPositionCircleRadius}px`,
					height: `${Config.values.plotSelectedPositionCircleRadius}px`,
				}, circleComponent.ref( "inner" ) )

				this.$modules.domComponent.addChild( "dom-layer", circleComponent.domElement )
				this.$modules.renderingEngine.addChild( circleRenderingObject )
				this.$temp.circlesRenderingObjects[ seriesName ] = circleRenderingObject
			} 

			circleRenderingObject.visible = true
			circleRenderingObject.position.set( seriesValue )

			console.log( seriesValue )
			
			if ( circleRenderingObject.soloRenderingAvailable ) {
				circleRenderingObject.render()
				this.$modules.renderingEngine.updateProjection()				
			} else {
				this.$modules.renderingEngine.updateProjection()				
			}


		} )
	}
}

export default MajorPlot