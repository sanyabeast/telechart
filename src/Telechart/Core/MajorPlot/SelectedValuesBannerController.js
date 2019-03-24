import Plot from "Telechart/Plot"
import Utils from "Telechart/Utils"
import DOMComponent from "Telechart/Core/DOM/Component"
import Config from "Telechart/Config"
import ChartMath from "Telechart/ChartMath"
import Tweener from "Telechart/Tweener"
import TelechartModule from "Telechart/Core/TelechartModule"
import GLEngine from "Telechart/GLEngine"

class SelectedValuesBannerController extends TelechartModule {
	get renderingObject () { return this.$modules.renderingObject }
	get renderingObjectLine () { return this.$modules.renderingObjectLine }

	constructor () {
		super()

		this.$state.series = new Utils.DataKeeper()
		this.$state.seriesValuesContainers = new Utils.DataKeeper()
		this.$state.position = ChartMath.point( 0, 0 )

		this.$modules.setMultiple( {
			domComponent: new DOMComponent( {
				template: "selected-values-banner"
			} )
		} )

		this.$modules.renderingObject = new GLEngine.DOMElement( {
			domElement: this.$modules.domComponent.domElement,
			applyScaleY: false,
			applyScaleX: false,
			applyPosY: false,
			applyPosX: true,
		} )

		this.$modules.renderingObjectLine = new GLEngine.Mesh( {
			geometry: new GLEngine.RectGeometry( {
				width: 2,
				height: 1
			} ),
			material: new GLEngine.Material( {
				vertexShader: "vert.grid-line-x",
				fragmentShader: "frag.default",
				uniforms: {
					diffuse: Config.glColors.gridPatternSelectedValueLineColor,
					selectedPosition: this.$state.position
				}
			} )
		} )

		this.$updateBannerAlign = this.$updateBannerAlign.bind( this )
	}

	setPosition ( x, y ) {
		this.renderingObject.position.x = x
		this.renderingObject.position.y = y

		this.$state.position.set( x, y )
		
		Utils.throttle( this.$updateBannerAlign, 50 )
	}

	updateSeriesValuesVisibility () {
	}

	setSeries ( seriesData ) {
		this.$state.series[ seriesData.series.id ] = seriesData
		this.$addSeriesValueContainer( seriesData )
	}

	setSeriesValues ( values ) {
		
		let x = 0
		let y = 0
		let dateSet = false


		Utils.loopCollection( values, ( point, seriesId )=>{

			x = point.x

			if ( !dateSet ) {
				this.$modules.domComponent.ref( "date-value" ).textContent = Utils.formatDate( point.x, "${weekdayName}, ${monthName} ${date}" )
			}

			if ( point.y > y ) {
				y = point.y
			}

			let valueContainer = this.$state.seriesValuesContainers[ seriesId ]
			valueContainer.ref( "value" ).textContent = point.y | 0

		} )

		this.setPosition( x, y )

	}

	$addSeriesValueContainer ( seriesData ) {
		let valueContainer = new DOMComponent( {
			"template": "selected-values-banner-value"
		} )

		valueContainer.ref( "caption" ).textContent = seriesData.series.name

		Utils.assignValues( valueContainer.ref( "caption" ).style, {
			color: seriesData.series.color
		} )

		Utils.assignValues( valueContainer.ref( "value" ).style, {
			color: seriesData.series.color
		} )

		this.$modules.domComponent.addChild( "series-values-wrapper", valueContainer.domElement )

		this.$state.seriesValuesContainers[ seriesData.series.id ] = valueContainer
	}

	$updateBannerAlign () {
		let parentNode = this.$modules.domComponent.domElement.parentNode
		let bannerNode = this.$modules.domComponent.domElement

		let parentNodeRect = parentNode.getBoundingClientRect()
		let bannerNodeRect = bannerNode.getBoundingClientRect()

		console.log( parentNodeRect, bannerNodeRect )

		if ( bannerNodeRect.right > parentNodeRect.right ) {
			bannerNode.classList.remove( "align-right" )
			bannerNode.classList.add( "align-left" )
		} else {
			bannerNode.classList.add( "align-right" )
			bannerNode.classList.remove( "align-left" )
		}

	}
}

export default SelectedValuesBannerController