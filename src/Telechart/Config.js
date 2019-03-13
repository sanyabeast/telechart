
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
		domDoubletapTimeout: 200
	}
}

export default Config