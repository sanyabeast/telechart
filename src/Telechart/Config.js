
/**
 * @class
 * Global config. Singleton
 *
 */
class Config {
	static DPR = window.devicePixelRatio
	static assets = {
		html: {},
		css: {},
		skins: {}
	}
	
	static isTouchDevice = ( "ontouchstart" in window )
	static values = {
		domDoubletapTimeout: 250,
		plotLineChunkSize: 10
	}

	static skinValues = {

	}
}

export default Config