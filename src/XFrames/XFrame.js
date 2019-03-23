import file_window_html from "txt!./window.xml";
import file_custom_controls_button from "txt!./custom_controls_button.xml";

class XFrame {
	get bodyElement () {
		return this.dom.querySelector(".body")
	}

	constructor (params) {
		this.state = {
			name: params.name,
			translation: {
				x: 0,
				y: 0
			},
			size: {
				x: 50,
				y: 50
			},
			callbacks: {
				onCreate: params.onCreate,
				onResize: params.onResize,
				onMove: params.onMove,
				onClose: params.onClose,
				onFocus: params.onFocus,
			}
		};

		this.dom = document.createElement("div");
		this.dom.classList.add("plot3.window");
		this.dom.innerHTML = file_window_html;

		this.dom = this.dom.children[0];

		this.dom.querySelector(".header .caption p").innerHTML = this.state.name;

		this.dom.addEventListener("click", this.state.callbacks.onFocus || function () {})
		
		this.$setupFocusing();
		this.$setupDragging();
		this.$setupResizing();
		this.$setupButtons();

		if (params.position) {
			this.setPosition(params.position.x, params.position.y);
		}

		if (params.size) {
			this.setSize(params.size.x, params.size.y);
		}

		document.body.appendChild(this.dom);

		this.state.callbacks.onCreate(this);
	}

	setBodyContent (dom) {
		this.dom.querySelector(".body").innerHTML = "";
		this.dom.querySelector(".body").appendChild(dom);
	}

	$setupFocusing () {

	}

	$setupDragging () {
		let header = this.dom.querySelector(".header");

		let state = {
			captured: false,
			x: 0,
			y: 0
		};

		header.addEventListener("mousedown", function (evt) {
			state.x = evt.pageX;
			state.y = evt.pageY;

			state.captured = true;
		}.bind(this));

		window.addEventListener("mouseup", function (evt) {
			state.x = evt.pageX;
			state.y = evt.pageY;

			state.captured = false;
		}.bind(this));

		window.addEventListener("mousemove", function (evt) {
			if (state.captured) {
				let dx = evt.pageX - state.x;
				let dy = evt.pageY - state.y;

				state.x = evt.pageX;
				state.y = evt.pageY;

				this.setPosition(
					this.state.translation.x + dx, 
					this.state.translation.y + dy
				);
			}
		}.bind(this));
	}

	$setupResizing () {
		let resizer = this.dom.querySelector(".resizer");

		let state = {
			captured: false,
			x: 0,
			y: 0
		};

		resizer.addEventListener("mousedown", function (evt) {
			state.x = evt.pageX;
			state.y = evt.pageY;

			state.captured = true;
		}.bind(this));

		window.addEventListener("mouseup", function (evt) {
			state.x = evt.pageX;
			state.y = evt.pageY;

			state.captured = false;
		}.bind(this));

		window.addEventListener("mousemove", function (evt) {
			if (state.captured) {
				let dx = evt.pageX - state.x;
				let dy = evt.pageY - state.y;

				state.x = evt.pageX;
				state.y = evt.pageY;

				this.setSize(
					this.state.size.x + dx, 
					this.state.size.y + dy
				);
				

				if (this.state.callbacks.onResize) {
					this.state.callbacks.onResize(this.state.size);
				}
			}
		}.bind(this));
	}

	$setupButtons () {
		let closeButton = this.dom.querySelector(".header .window-controls .button.close");

		closeButton.addEventListener("click", this.state.callbacks.onClose || function () {});
	}

	setPosition (x, y) {
		this.state.translation.x = x;
		this.state.translation.y = y;

		this.dom.style.transform = [
			"translate3d(", 
			x,
			"px, ",
			y,
			"px, 0px)"
		].join("");
	}

	setSize (x, y) {

		this.state.size.x = x;
		this.state.size.y = y;

		this.dom.style.width = x + "px";
		this.dom.style.height = y + "px";
		
	}

	addCustomButton (caption, callbacks, title) {
		let div = document.createElement("div");
		div.innerHTML = file_custom_controls_button;
		let button = div.children[0];

		button.querySelector("p").innerHTML = caption;
		  
		if (callbacks.onClick) button.addEventListener("click", callbacks.onClick);
		if (callbacks.onOver) button.addEventListener("mouseover", callbacks.onOver);
		if (callbacks.onOut) button.addEventListener("mouseout", callbacks.onOut);

		if (title) {
			button.setAttribute("title", title);
		}

		this.dom.querySelector(".custom-controls").appendChild(button);

	}

	close () {
		this.dom.remove();
	}

	setZIndex (value) {
		this.dom.style.zIndex = value || "";
	}

	makeStatic (key) {
		key ? this.dom.classList.add("static"): this.dom.classList.remove("static");
	}
}

export default XFrame;

