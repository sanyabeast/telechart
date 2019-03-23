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


	setExtremum ( extremum, tween ) {
		super.setExtremum( extremum, tween )

		let order = ChartMath.getOrder( extremum.size )
		let orderAlignStep = order / Config.values.gridOrderDivider

		console.log(order, orderAlignStep, extremum.size)

		this.$state.gridState.steps.y = order / 10
	}

	setSeriesVisibility ( seriesId, isVisible ) {
		super.setSeriesVisibility( seriesId, isVisible )
		this.$updateSelectedPositionCirclesVisibility() 
	}

	$updateSelectedPositionCirclesVisibility () {
		Utils.loopCollection( this.$temp.circlesRenderingObjects, ( circleRenderingObject, seriesId )=>{
			if ( this.$state.series && this.$state.series[ seriesId ] && this.$state.series[ seriesId ].visible ) {
				circleRenderingObject.$params.domComponent.classList.remove( "hidden" )
			} else {
				circleRenderingObject.$params.domComponent.classList.add( "hidden" )

			}
		} )
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
		Utils.loopCollection( values, ( seriesValue, seriesId )=>{
			let circleRenderingObject = this.$temp.circlesRenderingObjects[ seriesId ]

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
					borderColor: this.$state.series[ seriesId ].series.color,
					width: `${Config.values.plotSelectedPositionCircleRadius}px`,
					height: `${Config.values.plotSelectedPositionCircleRadius}px`,
				}, circleComponent.ref( "inner" ) )

				this.$modules.domComponent.addChild( "dom-layer", circleComponent.domElement )
				this.$modules.renderingEngine.addChild( circleRenderingObject )
				this.$temp.circlesRenderingObjects[ seriesId ] = circleRenderingObject
			} 

			circleRenderingObject.position.set( seriesValue )

			if ( circleRenderingObject.soloRenderingAvailable ) {
				circleRenderingObject.render()
				this.$modules.renderingEngine.updateProjection()				
			} else {
				this.$modules.renderingEngine.updateProjection()				
			}

			this.$updateSelectedPositionCirclesVisibility()


		} )
	}
}

export default MajorPlot