
/**
 * @class
 * Global config. Singleton
 *
 */
class Config {
	static isTouchDevice = ( "ontouchstart" in window )
}

export default Config