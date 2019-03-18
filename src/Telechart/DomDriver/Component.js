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

		this.$dom.element = this.$buildTemplate ( htmlString, params )	
	}

	ref ( name ) { return this.$refs[name] }
	addChild ( ref, domElement ) {
		this.$refs[ref].appendChild( domElement )
	}

	$buildTemplate ( htmlString, params ) {
		let dom = Utils.parseHTML( htmlString, params )

		this.$traverseDOM( dom, ( node, parentNode )=>{
			this.$processAttrs( node, parentNode, params )
		}, null )

		return dom;
	}

	$traverseDOM ( dom, callback/*node, parentNode*/, parentNode ) {
		callback ( dom, parentNode )

		Utils.loopCollection( dom.children, ( child, index )=>{
			let tagName = child.tagName.toLowerCase()

			if ( Config.assets.html[ tagName ] ) {

				let childComponent = new Component( {
					template: tagName
				} )

				child = dom.replaceChild( childComponent.domElement, child )
			}

			this.$traverseDOM( child, callback, parentNode )
		} )
	}

	$processAttrs ( node, parentNode, params ) {
		Utils.loopCollection( node.attributes, ( attr, index )=>{

			let computableProp = attr.value && attr.value.match(/{{(.*?)}}/)

			if ( computableProp ) {
				computableProp = computableProp[1]

				try {
					attr.value = eval( computableProp )
				} catch ( err ) {
					console.warn( `failed to compute prop: ${computableProp}`, err )
				}
			}

			switch ( true ) {
				case ( attr.name == "$ref" ):
					this.$refs[attr.value] = node
					node.$ref = attr.value
				break;
				case ( attr.name == "$css" ):
					Utils.loopCollection( attr.value.split(" "), ( cssAssetName, index )=>{
						Utils.injectCSS( cssAssetName, Config.assets.css[cssAssetName] )
					} )
				break;
				case ( attr.name == "$events" ):

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