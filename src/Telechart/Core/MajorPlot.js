import Plot from "Telechart/Plot"
import Utils from "Telechart/Utils"
import GLEngine from "Telechart/GLEngine"
import DOMComponent from "Telechart/Core/DOM/Component"
import Config from "Telechart/Config"
import ChartMath from "Telechart/ChartMath"
import Tweener from "Telechart/Tweener"

class MajorPlot extends Plot {
	constructor ( params ) {
		super( params )

		this.$temp.circlesRenderingObjects = {}
		
		this.$setupGrid() 

		this.$modules.domComponent.on( "dom.drag", this.$onUserDrag.bind(this) )
		this.$modules.domComponent.on( "dom.click", this.$onUserClick.bind(this) )
		this.$modules.domComponent.on( "dom.pan", this.$onUserPan.bind(this) )

	}

	$setupGrid () {

		this.$state.gridState = new Utils.DataKeeper( {
			steps: ChartMath.vec2( 0, 1000000 )
		} )

		let gridRectMaterial = new GLEngine.Material( {
			vertexShader: "vert.plot-grid",
			fragmentShader: "frag.plot-grid",
			uniforms: {
				gridSteps: this.$state.gridState.steps,
				diffuse: Config.glColors.gridPatternLineColor
			}
		} )
		
		let gridRectGeometry = new GLEngine.RectGeometry( {
			width: 1,
			height: 1
		} )

		let gridRectMesh = new GLEngine.Mesh( {
			geometry: gridRectGeometry,
			material: gridRectMaterial
		} )

		this.$modules.renderingEngine.addChild( gridRectMesh )
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
		
		if ( eventData.panDelta > 0 ) {
			let scale = this.$modules.renderingEngine.scale
			this.$modules.renderingEngine.setScale( scale.x * eventData.panDelta, scale.y )
		}

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

				circleRenderingObject = new GLEngine.DOMElement( {
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