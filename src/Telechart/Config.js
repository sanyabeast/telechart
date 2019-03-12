
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
}

export default Config