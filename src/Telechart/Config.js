/**
 * @author sanyabeast | github.com/sanyabeast | a.gvrnsk@gmail.com | telegram:sanyabeats
 */

 
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
		plotSelectedPositionCircleRadius: 10,
		plotMinFrameSize: 10,
		gridOrderDivider: 2,
		gridPatternYCaptionsCount: 5,
		gridPatternXCaptionsCount: 5,
	}

	static l18n = {
		"month_1": "Jan",
		"month_2": "Feb",
		"month_3": "March",
		"month_4": "Apr",
		"month_5": "May",
		"month_6": "Jun",
		"month_7": "Jul",
		"month_8": "Aug",
		"month_9": "Sep",
		"month_10": "Oct",
		"month_11": "Nov",
		"month_12": "Dec",
		"weekday_0": "Sun",
		"weekday_1": "Mon",
		"weekday_2": "Tue",
		"weekday_3": "Wed",
		"weekday_4": "Thu",
		"weekday_5": "Fri",
		"weekday_6": "Sat",
	}

	static skinValues = {

	}

	static glColors = {
		gridPatternLineColor: ChartMath.color( 1, 1, 1 ),
		gridPatternSelectedValueLineColor: ChartMath.color( 1, 1, 1 )
	}
}

export default Config