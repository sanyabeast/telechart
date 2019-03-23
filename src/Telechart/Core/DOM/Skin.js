import Utils from "Telechart/Utils"
import Config from "Telechart/Config"

class Skin {

	cssText = "";

	constructor ( skinData ) {
		this.$name = skinData.name
		this.$values = new Utils.DataKeeper( skinData.values )
		this.$updateCSS()
	}

	$updateCSS () {
		this.cssText = Utils.generateVarsCSS( this.$values )
	}

	apply () {
		Utils.injectCSS( "telechart-skin-vars", this.cssText )
		console.log( `skin ${this.$name} applied` )

		Utils.loopCollection( Config.glColors, ( color, name )=>{
			if ( this.$values[ name ] ) {
				color.setCSSHex( this.$values[ name ] )
			}
		} )

	}
}

export default Skin