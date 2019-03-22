import RenderingEngine from "Telechart/GLEngine"
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
			renderingEngine: new RenderingEngine(),
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
		this.$state.accuracy = seriesData.series.accuracy

		let pointsChunks = Utils.splitToChunks( seriesData.points, Config.plotChunkSize )
		let seriesGroup = new RenderingEngine.Group( {
			attributes: {
				"content-type": "series",
				"series-type": seriesData.series.type,
				"series-name": seriesData.series.name,
				"series-id": seriesData.series.id,
				"accuracy": seriesData.series.accuracy
			}
		} )

		Utils.loopCollection( pointsChunks, ( chunk, chunkIndex )=>{
			let line = new RenderingEngine.Line({
				styles: {
					lineWidth: ( Config.values.plotLineDefaultLineWidth * Config.DPR ),
					strokeStyle: seriesData.series.color
				},
				points: chunk,
				uniforms: {
					thickness: {
						type: "uniform1f",
						value: ChartMath.float32( 6 )
					},
					diffuse: {
						type: "uniform3fv",
						value: ChartMath.color( seriesData.series.color )
					}
				}
			})

			seriesGroup.addChild( line )
		} )

		this.setViewport( 
			seriesData.series.beginTime, 
			seriesData.extremum.min, 
			seriesData.series.finishTime - seriesData.series.beginTime,
			seriesData.extremum.max - seriesData.extremum.min 
		)

		this.setPosition( seriesData.series.beginTime )
		this.$modules.renderingEngine.addChild( seriesGroup )

		this.$state.series.set( seriesData.series.id, seriesData )

	}
	/* !CHARTING */

	startRendering () {
		this.stopRendering()
		this.stopRendering = MainLoop.addTask( this.$modules.renderingEngine.render )
	}

	render () {
		this.$modules.renderingEngine.render()
	}

	stopRendering () {}

	setExtremum ( extremum, tween ) {
		if ( !extremum.isFinite ) {
			return
		}

		if ( extremum.min == this.$state.extremum.min && this.$state.extremum.max == extremum.max ) {
			return
		}

		this.$state.extremum.set( extremum )

		let padding = extremum.size * Config.values.plotExtremumPadding

		extremum.min -= padding
		extremum.max += padding

		let vp = this.$modules.renderingEngine.viewport
		let position = this.$modules.renderingEngine.position

		if ( tween ) {
			this.$temp.killExtremumTweenY && ( this.$temp.killExtremumTweenY() )
			this.$temp.killExtremumTweenY = Tweener.tween( {
				fromValue: position.y,
				toValue: extremum.min,
				duration: Config.values.plotExtremumTweenDuration,
				ease: "linear",
				onUpdate: ( value, completed )=>{
					position.y = value
					this.$modules.renderingEngine.updateProjection()

					if ( completed ) {
						delete this.$temp.killExtremumTweenY()
					}
				}
			} )

			this.$temp.killExtremumTweenH && ( this.$temp.killExtremumTweenH() )
			this.$temp.killExtremumTweenH = Tweener.tween( {
				fromValue: vp.h,
				toValue: ( extremum.size ),
				duration: Config.values.plotExtremumTweenDuration,
				ease: "linear",
				onUpdate: ( value, completed )=>{
					vp.h = value
					this.$modules.renderingEngine.updateProjection()

					if ( completed ) {
						delete this.$temp.killExtremumTweenH()
					}
				}
			} )
		} else {
			vp.y = extremum.min
			vp.h = ( extremum.max - extremum.min )
		}
	}

	setSeriesVisibility ( seriesId, isVisible ) {
		this.$modules.renderingEngine.select( {
			"content-type": "series",
			"series-id": seriesId,
		}, ( object )=>{

			if ( isVisible ) object.visible = isVisible

			Tweener.tween( {
				fromValue: object.alpha,
				toValue: ( isVisible ) ? 1 : 0,
				duration: Config.values.plotSeriesVisibilityTweenDuration,
				ease: ( isVisible ) ? "easeInQuad" : "easeOutQuad",
				onUpdate: ( v, completed )=>{
					object.alpha = v
					this.$modules.renderingEngine.updateProjection()

					if ( completed && !isVisible ) {
						object.isVisible = isVisible
					}
				}
			} )
		} )
	}

	setSeriesAccuracyVisibility ( accuracy, isVisible ) {
		this.$modules.renderingEngine.select( {
			"content-type": "series",
			"accuracy": `${accuracy}`
		}, ( object )=>{

			if ( isVisible ) object.visible = isVisible

			Tweener.tween( {
				fromValue: object.alpha,
				toValue: ( isVisible ) ? 1 : 0,
				duration: Config.values.plotSeriesVisibilityTweenDuration,
				ease: ( isVisible ) ? "easeInQuad" : "easeOutQuad",
				onUpdate: ( v, completed )=>{
					object.alpha = v
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