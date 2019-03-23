/**
 * @author sanyabeast | github.com/sanyabeast | a.gvrnsk@gmail.com | telegram:sanyabeats
 */

 
class Rect {
	x = 0
	y = 0
	w = 0
	h = 0

	constructor ( x, y, w, h ) {
		this.set( x, y, w, h )
	} 

	set ( x, y, w, h ) {
		this.x = x
		this.y = y
		this.w = w
		this.h = h
	}
}

export default Rect