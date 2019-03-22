import TelechartModule from "Telechart/Core/TelechartModule"
import ChartMath from "Telechart/ChartMath"
import Utils from "Telechart/Utils"
import Config from "Telechart/Config"
import DOMComponent from "Telechart/Core/DOM/Component"

import Geometry from "Telechart/GLEngine/Core/Geometry"
import Material from "Telechart/GLEngine/Core/Material"
import Mesh from "Telechart/GLEngine/Core/Mesh"
import Uniform from "Telechart/GLEngine/Core/Uniform"
import RenderingObject from "Telechart/GLEngine/Core/RenderingObject"
import DOMElement from "Telechart/GLEngine/DOMElement"

import Group from "Telechart/GLEngine/Group"
import Line from "Telechart/GLEngine/Line"

class GLEngine extends Utils.aggregation( TelechartModule, RenderingObject ) {
	static Geometry = Geometry
	static Material = Material
	static Mesh = Mesh
	static RenderingObject = RenderingObject
	static Uniform = Uniform
   static DOMElement = DOMElement

   static Group = Group
   static Line = Line

   get domElement () { return this.$dom.canvasElement }

	constructor () {
		super()

      this.$modules = {
         canvas: new DOMComponent( {
            template: "canvas-element"
         } ),
      }


      this.$dom = {
         canvasElement: this.$modules.canvas.domElement,
      }

      this.$state = {
         gl: this.$dom.canvasElement.getContext( "webgl" ),
         size: ChartMath.vec2( 1, 1 ),
         position: ChartMath.vec2( 0, 0 ),
         scale: ChartMath.vec2( 1, 1 ),
         viewport: ChartMath.rect( 0, 0, 1, 1 ),
         worldPosition: ChartMath.vec2( 0, 0 ),
         worldScale: ChartMath.vec2( 1, 1 ),
         culledObjectsCount: 0,
         projectionModified: true,
         sizeNeedsUpdate: true
      }

      Utils.proxyProps( this, this.$state, [
         "position",
         "scale",
         "viewport",
         "size",
         "worldScale",
         "worldPosition"
      ] )

 
	   this.render = this.render.bind( this )

	}

	setSize ( w, h ) {
      w *= Config.DPR
      h *= Config.DPR

      if ( this.$state.size.x === w  && this.$state.size.y === h ) {
         return
      }

      if ( !w || !h ){
         return
      }

      this.$dom.canvasElement.width = w
      this.$dom.canvasElement.height = h
      
      this.$state.size.set( w, h )
      this.$state.gl.viewport( 0, 0, w, h )

      this.updateProjection()
	}

   setScale ( x, y ) {
      this.$state.viewport.w = this.$state.size.x * x
      this.$state.viewport.h = this.$state.size.y * y

      this.updateProjection()
   }

   setPosition (x, y ) {
      y = ( typeof y == "number" ) ? y : this.$state.position.y
      this.$state.position.x = x
      this.$state.position.y = y

      this.updateProjection()
   }

   setViewport ( x, y, w, h ) {
      let viewport = this.$state.viewport

      viewport.x = x
      viewport.y = y
      viewport.w = w
      viewport.h = h

      this.$state.position.set( viewport.x, viewport.y )

      this.emit( "viewport.updated", viewport )
      this.updateProjection()
   } 


	fitSize () {
		if ( this.domElement.parentNode) {
			let rect = this.domElement.parentElement.getBoundingClientRect()
			this.setSize( rect.width, rect.height )
		}
	}

   isCulled ( child, px, py ) {
      if ( !child.visible ) return true

      if ( !child.culled ) {
         return false
      } else {
         let boundRect = child.getBoundRect()
         let translatedRect = ChartMath.translateRect( this.$temp.boundRect, boundRect, px, py )
         child.projectionCulled = !ChartMath.rectIntersectsRect( translatedRect, this.$state.viewport )

         return child.projectionCulled
      }
   }

   updateProjection () {
      let viewport = this.$state.viewport
      let position = this.$state.position
      let worldPosition = this.$state.worldPosition
      let worldScale = this.$state.worldScale
      let size = this.$state.size

      this.$state.scale.set(
         viewport.w / size.x,
         viewport.h / size.y
      )

      viewport.x = position.x
      viewport.y = position.y

      worldPosition.x = viewport.x
      worldPosition.y = viewport.y

      worldScale.x = this.$state.scale.x / 2.
      worldScale.y = this.$state.scale.y / 2.

      this.$state.projectionModified = true
   }

   toReal ( x, y ) {
      return ChartMath.point(
         ( (x - this.position.x) / this.scale.x ) | 0, 
         ( this.size.y - ((y - this.position.y) / this.scale.y) ) | 0
      )

   }

   toRealScale ( x, y ) {
      return ChartMath.point(
         ( x / this.scale.x ) | 0,
         ( y / this.scale.y ) | 0,
      )
   }

   toVirtual ( x, y ) {
      return ChartMath.point(
         ( ( x * this.scale.x ) + this.position.x ),
         ( ( ( this.size.y - y )   * this.scale.y ) + this.position.y ),
      )
   } 

   toVirtualScale ( x, y ) {
      return ChartMath.point(
         x * this.scale.x,
         y * this.scale.y,
      )
   }

	render ( force ) {

      this.fitSize()

      if ( true || this.$state.projectionModified || force === true ) {
         this.$state.projectionModified = false;
         super.render( this, this.$state.gl, -this.$state.position.x, -this.$state.position.y, 1 )
      }
	}

   updateValue ( value ) {
      this.value = value || this.value
   }
}

export default GLEngine