/**
 * @author sanyabeast | github.com/sanyabeast | a.gvrnsk@gmail.com | telegram:sanyabeats
 */

 
import TelechartModule from "Telechart/Core/TelechartModule"
import Utils from "Telechart/Utils"
import Config from "Telechart/Config"
import DOMElementEventHandler from "Telechart/Core/DOM/DOMElementEventHandler"

class Component extends TelechartModule {
	get domElement () { return this.$dom.element }
	get classList () { return this.domElement.classList }

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
			this.$traverseDOM( child, callback, child.parentNode )
		} )
	}


	$processAttrs ( node, parentNode, params ) {
		Utils.loopCollection( node.attributes, ( attr, index )=>{
			switch ( attr.name ) {
				case "$ref":
					this.$refs[attr.value] = node
					node.$ref = attr.value
				break;
				case "$css":
					Utils.loopCollection( attr.value.split(" "), ( cssAssetName, index )=>{
						Utils.injectCSS( cssAssetName, Config.assets.css[cssAssetName] )
					} )
				break;
				case "$events":

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