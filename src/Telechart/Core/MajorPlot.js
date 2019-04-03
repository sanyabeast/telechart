/**
 * @author sanyabeast | github.com/sanyabeast | a.gvrnsk@gmail.com | telegram:sanyabeats
 */

 
import Plot from "Telechart/Plot"
import Utils from "Telechart/Utils"
import GLEngine from "Telechart/GLEngine"
import DOMComponent from "Telechart/Core/DOM/Component"
import Config from "Telechart/Config"
import ChartMath from "Telechart/ChartMath"
import Tweener from "Telechart/Tweener"

import SelectedValuesBannerController from "Telechart/Core/MajorPlot/SelectedValuesBannerController"

class MajorPlot extends Plot {
	constructor ( params ) {
		super( params )

		this.$temp.circlesRenderingObjects = {}
		this.$temp.prevScaleX = -1

		this.$modules.selectedValuesBannerController = new SelectedValuesBannerController()
		this.$modules.domComponent.addChild( "dom-layer", this.$modules.selectedValuesBannerController.domElement )
		this.$modules.renderingEngine.addChild( this.$modules.selectedValuesBannerController.renderingObject )
		this.$modules.renderingEngine.addChild( this.$modules.selectedValuesBannerController.renderingObjectLine )
			
		this.$setupGrid() 

		this.$modules.domComponent.on( "dom.drag", this.$onUserDrag.bind(this) )
		this.$modules.domComponent.on( "dom.pointerdown", this.$onPointerDown.bind(this) )
		this.$modules.domComponent.on( "dom.pointerup", this.$onPointerUp.bind(this) )

		this.$updateGridCaptionsX = this.$updateGridCaptionsX.bind( this )

		this.$modules.renderingEngine.on( "projection.updated", ( viewport )=>{
			Utils.throttle( this.$modules.selectedValuesBannerController.updateBannerAlign, 25 )
			this.$updateGridCaptionsX()
		} )

		
	}

	addSeries ( seriesData ) {
		super.addSeries( seriesData )
		this.$modules.selectedValuesBannerController.setSeries( seriesData )
	}

	$setupGrid () {

		this.$state.gridState = new Utils.DataKeeper( {
			steps: ChartMath.vec2( 20, 1000000 ),
		} )

		this.$temp.gridLineMeshes = []

		Utils.loop( 0, Config.values.gridPatternXCaptionsCount, 1, true, ( index )=>{

			let gridLineMaterial = new GLEngine.Material( {
				vertexShader: "vert.grid-line-y",
				fragmentShader: "frag.default",
				uniforms: {
					gridSteps: this.$state.gridState.steps,
					diffuse: Config.glColors.gridPatternLineColor,
					lineIndex: ChartMath.float32( index ),
					opacity: ChartMath.float32( 0.5 )
				}
			} )

			let gridLineGeometry = new GLEngine.RectGeometry( {
				width: 1,
				height: 1
			} )

			let gridLineMesh = new GLEngine.Mesh( {
				geometry: gridLineGeometry,
				material: gridLineMaterial
			} )

			this.$temp.gridLineMeshes[ index ] = gridLineMesh

			this.$modules.renderingEngine.addChild( gridLineMesh )
		} )

		this.$setupGridCaptions()
	}

	$updateGridCaptionsX () {
		let viewport = this.$modules.renderingEngine.viewport
		let scale = this.$modules.renderingEngine.scale

		/* updating time-captions */
		let vpw = viewport.w
		let accuracy = this.$state.accuracy
		let order = ChartMath.getOrder( vpw )

		let multiplier = Math.ceil( ( vpw / accuracy ) / ( Config.values.gridPatternXCaptionsCount + 1 ) )
		multiplier = ChartMath.nearestPowerOfTwo( multiplier, true )

		let step = ChartMath.nearestMult( accuracy, accuracy * multiplier * 2, true, true )

		let vpx = viewport.x

		let start = ChartMath.nearestMult( vpx - step, step, false, true )

		this.$temp.prevScaleX = scale.x

		Utils.loopCollection( this.$temp.gridCaptionsX, ( data, index )=>{
			let value = start + ( index * step )

			data.object.position.x = value
			data.object.render()

			if ( data.value !== value ) {
				data.value = value
				data.component.ref( "caption" ).textContent = Utils.formatDate( value, "${monthName} ${date}" )
			}
		} )
	}

	$updateGridCaptionsY ( viewport ) {
		/* updating time-captions */
		let step = this.$state.gridState.steps.y
		let vpx = this.$modules.renderingEngine.viewport.y

		let start = ChartMath.nearestMult( vpx - step, step, false, true )

		Utils.loopCollection( this.$temp.gridCaptionsY, ( data, index )=>{
			let value = start + ( index * step )

			data.object.position.y = value
			data.object.render()

			if ( data.value !== value ) {

				if ( value < 0 ) {
					data.component.classList.add( "hidden" )
				} else {
					data.value = value
					data.component.ref( "caption" ).textContent = Utils.formatValue( value )					
				}

			}
		} )
	}

	$setupGridCaptions () {
		this.$temp.gridCaptionsX = {}
		this.$temp.gridCaptionsY = {}

		/* setting up time captions */
		Utils.loop( 0, Config.values.gridPatternXCaptionsCount, 1, true, ( index )=>{


			let gridCaptionComponent = new DOMComponent( {
				template: "grid-caption",
				classList: [ "time" ]
			} )

			let gridCaptionRO = new GLEngine.DOMElement( {
				domElement: gridCaptionComponent.domElement,
				domComponent: gridCaptionComponent,
				applyScaleY: false,
				applyScaleX: false,
				applyPosY: false,
				applyPosX: true,
			} )

			this.$modules.domComponent.addChild( "dom-layer", gridCaptionComponent.domElement )

			this.$temp.gridCaptionsX[ index ] = {
				component: gridCaptionComponent,
				object: gridCaptionRO
			}

			this.$modules.renderingEngine.addChild( gridCaptionRO )

		} )

		/* setting up value captions */
		Utils.loop( 0, Config.values.gridPatternYCaptionsCount, 1, true, ( index )=>{

			let gridCaptionComponent = new DOMComponent( {
				template: "grid-caption",
				classList: [ "value" ]
			} )

			let gridCaptionRO = new GLEngine.DOMElement( {
				domElement: gridCaptionComponent.domElement,
				domComponent: gridCaptionComponent,
				applyScaleY: false,
				applyScaleX: false,
				applyPosY: true,
				applyPosX: false,
			} )

			this.$modules.domComponent.addChild( "dom-layer", gridCaptionComponent.domElement )

			this.$temp.gridCaptionsY[ index ] = {
				component: gridCaptionComponent,
				object: gridCaptionRO
			}

			this.$modules.renderingEngine.addChild( gridCaptionRO )

		} )

	}

	setExtremum ( extremum, tween ) {
		
		if ( super.setExtremum( extremum, tween ) ) {
			let order = ChartMath.getOrder( extremum.size / 2 )
			let orderAlignStep = order / Config.values.gridOrderDifder
			let multiplier = Math.ceil( ( extremum.size / order ) / ( Config.values.gridPatternYCaptionsCount - 1) )

			this.$state.gridState.steps.y = order * multiplier

			this.$state.gridState.steps.update()
			
			this.$updateGridCaptionsY()
		}
	}

	setSeriesVisibility ( seriesId, isVisible ) {
		super.setSeriesVisibility( seriesId, isVisible )
		this.$updateSelectedPositionCirclesVisibility() 
	}

	$updateSelectedPositionCirclesVisibility () {
		this.$modules.selectedValuesBannerController.updateSeriesValuesVisibility()

		Utils.loopCollection( this.$temp.circlesRenderingObjects, ( circleRenderingObject, seriesId )=>{
			if ( this.$state.selectedValuesVisibility && this.$state.series && this.$state.series[ seriesId ] && this.$state.series[ seriesId ].visible ) {
				circleRenderingObject.$params.domComponent.classList.remove( "hidden" )
			} else {
				circleRenderingObject.$params.domComponent.classList.add( "hidden" )

			}
		} )
	}

	$onUserDrag ( eventData ) {
		this.$state.selectedValuesVisibility = true
		let position = this.$modules.renderingEngine.toVirtual( eventData.x, eventData.y )
		this.emit( "user.position.select", position )
	}

	$onPointerDown ( eventData ) {
		this.$state.selectedValuesVisibility = true
		this.$updateSelectedPositionCirclesVisibility() 
		let position = this.$modules.renderingEngine.toVirtual( eventData.x, eventData.y )
		this.emit( "user.position.select", position )
	}

	$onPointerUp ( eventData ) {
		this.$modules.selectedValuesBannerController.setBannerVisibility( false )
		this.$modules.renderingEngine.render( true )
		this.$state.selectedValuesVisibility = false
		this.$updateSelectedPositionCirclesVisibility() 
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

		this.$modules.selectedValuesBannerController.setSeriesValues( values )

	}
}

export default MajorPlot