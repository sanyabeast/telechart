import TelechartModule from "Telechart/Utils/TelechartModule"
import Utils from "Telechart/Utils"
import Config from "Telechart/Config"
import DOMElementEventHandler from "Telechart/DomDriver/DOMElementEventHandler"

class Component extends TelechartModule {
	get domElement () { return this.$dom.element }

	constructor ( params ) {
		super()

		this.$refs = {}
		this.$dom = {}
		this.$children = []

		this.$state = {
			template: params.template,
			eventHandlers: []
		}
		
		let htmlString = Config.assets.html[params.template]	

		this.$dom.element = this.$buildTemplate ( htmlString )	
	}

	ref ( name ) { return this.$refs[name] }
	addChild ( ref, domElement ) {
		this.$refs[ref].appendChild( domElement )
	}

	$buildTemplate ( htmlString ) {
		let dom = Utils.parseHTML( htmlString )

		this.$traverseDOM( dom, ( node, parentNode )=>{
			this.$processAttrs( node, parentNode )
		}, null )

		return dom;
	}

	$traverseDOM ( dom, callback/*node, parentNode*/, parentNode ) {
		callback ( dom, parentNode )

		Utils.loopCollection( dom.children, ( child, index )=>{
			this.$traverseDOM( child, callback, parentNode )
		} )
	}

	$processAttrs ( node, parentNode ) {
		Utils.loopCollection( node.attributes, ( attr, index )=>{
			switch ( true ) {
				case (attr.name == "$ref"):
					this.$refs[attr.value] = node
					node.$ref = attr.value
				break;
				case (attr.name == "$css"):
					Utils.loopCollection( attr.value.split(" "), ( cssAssetName, index )=>{
						Utils.injectCSS( cssAssetName, Config.assets.css[cssAssetName] )
					} )
				break;
				case (attr.name == "$events"):

					console.log(node, parentNode)

					let eventHandler = new DOMElementEventHandler( {
						domElement: node,
						eventsList: attr.value.split(" ")
					} )


					eventHandler.on( "$event", ( data )=>{
						let ref = node.$ref || "";
						this.emit( `${ref}.${data.type}`, data.payload )
					} )

					this.$state.eventHandlers.push( eventHandler )
				break;
			}
		} )
	}
}

export default Component