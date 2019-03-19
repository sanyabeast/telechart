import Plot from "Telechart/Plot"
import Utils from "Telechart/Utils"
import RenderingEngine from "Telechart/RenderingEngine"

class MajorPlot extends Plot {
	constructor ( params ) {
		super( params )

		this.$temp.circlesRenderingObjects = {}

		this.$modules.domComponent.on( "dom.drag", this.$onUserDrag.bind(this) )
		this.$modules.domComponent.on( "dom.click", this.$onUserClick.bind(this) )
		this.$modules.domComponent.on( "dom.pan", this.$onUserPan.bind(this) )

	}

	$onUserDrag ( eventData ) {
		let position = this.$modules.renderingEngine.toVirtual( eventData.x, eventData.y )
		this.emit( "user.position.select", position )
	}

	$onUserClick ( eventData ) {
		let position = this.$modules.renderingEngine.toVirtual( eventData.x, eventData.y )
		this.emit( "user.position.select", position )
	}

	$onUserPan ( eventData ) {
		console.log( eventData )
	}

	setSelectedPositionValues ( values ) {
		console.log( values )

		Utils.loopCollection( this.$temp.circlesRenderingObjects, ( circleObject, name )=>{
			circleObject.visible = false
		} )

		Utils.loopCollection( values, ( seriesValue, seriesName )=>{

			if ( !this.$temp.circlesRenderingObjects[ seriesName ] ) {
				console.log(1)
				let circleRenderingObject = new RenderingEngine.Circle( {
					radius: 10
				} )


				circleRenderingObject.culled = false
				this.$temp.circlesRenderingObjects[ seriesName ] = circleRenderingObject
				this.$modules.renderingEngine.addChild( circleRenderingObject )
			} 

		
			this.$temp.circlesRenderingObjects[ seriesName ].position.set(seriesValue)
			console.log(this.$temp.circlesRenderingObjects[ seriesName ].position)

			this.$modules.renderingEngine.updateProjection()

		} )
	}
}

export default MajorPlot