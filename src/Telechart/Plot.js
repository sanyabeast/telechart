import RenderingEngine from "Telechart/RenderingEngine"
import Utils from "Telechart/Utils"
import TelechartModule from "Telechart/Utils/TelechartModule"
import MainLoop from "Telechart/MainLoop"
import Tweener from "Telechart/Tweener"

import plot_html from "txt!html/plot.html"

class Plot extends TelechartModule {
	get position () { return this.$modules.renderingEngine.position }
	get scale () { return this.$modules.renderingEngine.scale }
	get domElement () { return this.$dom.rootElement }

	constructor () {
		super()

		this.$dom = {
			rootElement: Utils.parseHTML( plot_html )
		}

		this.$modules = {
			renderingEngine: new RenderingEngine()
		}


		this.$createTestLines()

		this.$dom.rootElement.querySelector( ".canvas-wrapper" ).appendChild( this.$modules.renderingEngine.domElement )

		Tweener.tween({
			fromValue: 20,
			toValue: 0.2,
			duration: 2000,
			onUpdate: (value, completed)=>{
				this.$modules.renderingEngine.setScale( this.$modules.renderingEngine.scale.x, value )
			}
		})

		Tweener.tween({
			fromValue: 20,
			toValue: 0.2,
			duration: 1000,
			onUpdate: (value, completed)=>{
				this.$modules.renderingEngine.setScale( value, this.$modules.renderingEngine.scale.y )
			}
		})

		MainLoop.addTask( this.$modules.renderingEngine.render )
	}

	fitSize ( ...args ) {
		return this.$modules.renderingEngine.fitSize(...args)
	}

	setPosition ( ...args ) {
		return this.$modules.renderingEngine.setPosition(...args)
	}

	setScale ( ...args ) {
		return this.$modules.renderingEngine.setScale(...args)
	}

	toVirtual ( ...args ) {
		return this.$modules.renderingEngine.toVirtual(...args)
	}

	toVirtualScale ( ...args ) {
		return this.$modules.renderingEngine.toVirtualScale(...args)
	}

	$createTestLines () {

		this.$modules.renderingEngine.setScale( this.$modules.renderingEngine.scale.x, 30 / this.$modules.renderingEngine.size.y )

		let line = new RenderingEngine.Line()

		let points = []

		for (var a = 0; a < 100; a++){
			points.push({
				x: a,
				y: Math.random() * 30
			})
		}

		line.setPoints( points )

		line.setStyles( {
			lineWidth: 4,
			strokeColor: "#ff0000"
		} )

		this.$modules.renderingEngine.addChild( line )

		/**/
		line = new RenderingEngine.Line()

		points = []

		for ( var a = 0; a < 100; a++ ){
			points.push({
				x: a + 100,
				y: Math.random() * 30
			})
		}

		line.setPoints( points )

		line.setStyles( {
			lineWidth: 4,
			strokeColor: "#00ff00"
		} )

		this.$modules.renderingEngine.addChild( line )

		/**/
		line = new RenderingEngine.Line()

		points = []

		for (var a = 0; a < 100; a++){
			points.push({
				x: a + 200,
				y: Math.random() * 30
			})
		}

		line.setPoints( points )

		line.setStyles( {
			lineWidth: 4,
			strokeColor: "#ffff00"
		} )

		this.$modules.renderingEngine.addChild( line )
	}
}

export default Plot