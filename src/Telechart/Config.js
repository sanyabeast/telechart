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
		skins: {}
	}
	
	static isTouchDevice = ( "ontouchstart" in window )
	static values = {
		domDoubletapTimeout: 250,
		plotLineChunkSize: 30,
		plotLineDefaultLineWidth: 2,
		plotExtremumTweenDuration: 250,
		plotExtremumPadding: ChartMath.range( 0, 0.2 )
	}

	static skinValues = {

	}
}

export default Config