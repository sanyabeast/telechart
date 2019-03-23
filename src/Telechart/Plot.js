import GLEngine from "Telechart/GLEngine"
import Utils from "Telechart/Utils"
import TelechartModule from "Telechart/Core/TelechartModule"
import MainLoop from "Telechart/MainLoop"
import Tweener from "Telechart/Tweener"
import ChartMath from "Telechart/ChartMath"
import DOMComponent from "Telechart/Core/DOM/Component"
import Config from "Telechart/Config"

/* plot */
class Plot extends TelechartModule {
	get position () { return this.$modules.renderingEngine.position }
	get scale () { return this.$modules.renderingEngine.scale }
	get viewport () { return this.$modules.renderingEngine.viewport }

	constructor ( params ) {
		super()
		
		this.$state.set( {
			extremum: ChartMath.range( 0, 0 ),
			series: new Utils.DataKeeper(),
		} )


		this.$modules.set( {
			renderingEngine: new GLEngine(),
			domComponent: new DOMComponent( {
				template: "plot",
				...params
			} ),
		} )

		Utils.proxyMethods( this, this.$modules.renderingEngine, [
			"toVirtual",
			"toVirtualScale",
			"setViewport",
			"fitSize",
			"setPosition",
			"setScale"
		] )

		this.$modules.domComponent.addChild( "canvas-wrapper", this.$modules.renderingEngine.domElement )
	}

	/* CHARTING */
	addSeries ( seriesData ) {

		this.$state.beginTime = seriesData.series.beginTime
		this.$state.finishTime = seriesData.series.finishTime

		let seriesLine = new GLEngine.Line({
			points: seriesData.points,
			attributes: {
				"content-type": "series",
				"series-type": seriesData.series.type,
				"series-name": seriesData.series.name,
				"series-id": seriesData.series.id,
			},
			uniforms: {
				thickness: ChartMath.float32( 2 ),
				diffuse: ChartMath.color( seriesData.series.color )
			}
		})

		this.setViewport( 
			seriesData.series.beginTime, 
			seriesData.extremum.min, 
			seriesData.series.finishTime - seriesData.series.beginTime,
			seriesData.extremum.max - seriesData.extremum.min 
		)

		this.setPosition( seriesData.series.beginTime )
		this.$modules.renderingEngine.addChild( seriesLine )

		this.$state.series.set( seriesData.series.id, seriesData )

	}
	/* !CHARTING */

	startRendering () {
		this.stopRendering()
		this.stopRendering = MainLoop.addTask( this.$modules.renderingEngine.render )
	}

	render ( force ) {
		this.$modules.renderingEngine.render( force )
	}

	stopRendering () {}

	setExtremum ( extremum, tween ) {
		if ( !extremum.isFinite ) {
			return
		}

		if ( extremum.min == this.$state.extremum.min && this.$state.extremum.max == extremum.max ) {
			return
		}


		if ( this.$temp.killExtremumTween ) {
			this.$temp.killExtremumTween()
			delete this.$temp.killExtremumTween
		}

		this.$state.extremum.set( extremum )

		extremum = this.$processExtremum( extremum )

		let viewport = this.$modules.renderingEngine.viewport

		let vpy = viewport.y
		let vph = viewport.h

		if ( /*false && */tween ) {
			this.$temp.killExtremumTween = Tweener.tween( {
				fromValue: 0,
				toValue: 1,
				duration: Config.values.plotExtremumTweenDuration,
				ease: "linear",
				onUpdate: ( progress, completed )=>{
					this.$modules.renderingEngine.position.y = ChartMath.smoothstep( vpy, extremum.min, progress )
					this.$modules.renderingEngine.viewport.h = ChartMath.smoothstep( vph, extremum.size, progress )
					this.$modules.renderingEngine.updateProjection()


					if ( completed ) {
						delete this.$temp.killExtremumTween()
					}
				}
			} )
			
		} else {
			this.$modules.renderingEngine.setViewport( viewport.x, extremum.min, viewport.w, extremum.size )
		}
	}

	$processExtremum ( extremum ) {
		let order = ChartMath.getOrder( extremum.size )
		let orderAlignStep = order / Config.values.gridOrderDivider

		// let padding = extremum.size * Config.values.plotExtremumPadding

		// extremum.min -= padding
		// extremum.max += padding

		extremum.min = ChartMath.nearestMult( extremum.min, orderAlignStep, false, true )
		extremum.max = ChartMath.nearestMult( extremum.max, orderAlignStep, true, true )

		return extremum
	}

	setSeriesVisibility ( seriesId, isVisible ) {
		this.$state.series[ seriesId ].visible = isVisible

		this.$modules.renderingEngine.select( {
			"content-type": "series",
			"series-id": seriesId,
		}, ( object )=>{

			if ( isVisible ) object.visible = isVisible

			Tweener.tween( {
				fromValue: object.opacity.value,
				toValue: ( isVisible ) ? 1 : 0,
				duration: Config.values.plotSeriesVisibilityTweenDuration,
				ease: ( isVisible ) ? "easeInQuad" : "easeOutQuad",
				onUpdate: ( v, completed )=>{
					object.opacity.value = v
					this.$modules.renderingEngine.updateProjection()

					if ( completed && !isVisible ) {
						object.isVisible = isVisible
					}
				}
			} )
		} )
	}
}

export default Plot