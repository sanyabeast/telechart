import XFrame from "XFrames/XFrame";

class XFrames {
	constructor () {
		this.content = {};
	}

	create (params) {
		this.content[params.id] = new XFrame(params);
	}

	remove (id) {
		let xframe = this.content[id];
		delete this.content[id];
		xframe.close();
	}

	setFocus (id) {
		for (let k in this.content) {
			if (k == id) {
				this.content[k].setZIndex(99999);
			} else {
				this.content[k].setZIndex(1);
			}
		}
	}

	makeStatic (key) {
		for (let k in this.content) {
			this.content[k].makeStatic(key);
		}
	}
}

export default XFrames;

