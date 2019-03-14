
/**
 * @class
 * Global config. Singleton
 *
 */
class Config {
	static assets = {
		html: {},
		css: {}
	}
	
	static isTouchDevice = ( "ontouchstart" in window )
	static values = {
		domDoubletapTimeout: 250
	}
}

export default Config