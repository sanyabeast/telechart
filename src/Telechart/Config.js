import ChartMath from "Telechart/ChartMath"


/**
 * @class
 * Global config. Singleton
 *
 */
class Config {
	static activeSkin = null;
	static plotChunkSize = 15;
	static DPR = window.devicePixelRatio
	static assets = {
		html: {},
		css: {},
		skins: {},
		shaders: {}
	}
	
	static isTouchDevice = ( "ontouchstart" in window )
	static values = {
		domDoubletapTimeout: 250,
		plotLineDefaultLineWidth: 2,
		plotExtremumTweenDuration: 150,
		plotSeriesVisibilityTweenDuration: 150,
		plotExtremumPadding: 0.35,
		plotSelectedPositionCircleRadius: 10
	}

	static skinValues = {

	}

	static glColors = {
		gridPatternLineColor: ChartMath.color( 1, 1, 1 )
	}
}

export default Config