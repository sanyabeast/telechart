import XFrames from "XFrames"
import Utils from "Telechart/Utils"
import Telechart from "Telechart/Telechart"
import Tweener from "Telechart/Tweener"
import MainLoop from "Telechart/MainLoop"
import ChartMath from "Telechart/ChartMath"

import GLEngine from "Telechart/GLEngine"


import chartData from "chart_data.json"

let isMobile = !!('ontouchstart' in window || navigator.msMaxTouchPoints);
let chartsCount = isMobile ? 1 : 4
let padding = 16;
let rowSize = Math.ceil(Math.sqrt(chartsCount));
let windowWidth = window.innerWidth - ((rowSize + 1) * padding);
let windowHeight = window.innerHeight - ((rowSize + 1) * padding);

// if (isMobile){
//     document.body.addEventListener("click", ()=>{
//         try {
//             document.body.webkitRequestFullScreen()
//         } catch (err) {}

//         try {
//             document.body.requestFullScreen()
//         } catch (err) {}
//     })
// }


class App {
    constructor () {
        this.telecharts = []
        this.xframes = new XFrames();
        // isMobile = true;

        if (isMobile) {
            document.body.classList.add("mobile");
        }

        this.createCharts(chartsCount)

        let addButton = document.body.querySelector(".button.add-window");
        addButton.addEventListener("click", ()=>{
            this.addTelechart( 100, 100, 300, 300 )
        });

        // window.benchmark = new Benchmark(this, unicycle)
        // window.benchmark.check();

        /**/
        if ( !isMobile ) {
            let glengine = window.glengine = new GLEngine();
            this.xframes.create({
                id: "glengine",
                name: "glengine",
                position: {
                    x: 500,
                    y: 500
                },
                size: {
                    x: 400,
                    y: 400
                },
                onCreate: (xframe)=>{
                    xframe.bodyElement.appendChild( glengine.domElement )
                    glengine.setSize( 400, 400 )
                },
            });

            let boxGroup = new GLEngine.Group()
            for ( var a = 0; a < 10; a++ ){
                let geometry = new GLEngine.Geometry( {
                    attributes: {
                        coords: [
                            0, 0,
                            0, 10,
                            10, 0,
                            10, 0,
                            0, 10,
                            10, 10,
                        ]
                    }
                } )

                let material = new GLEngine.Material( {
                    vertexShader: "vert.default",
                    fragmentShader: "frag.default",
                    uniforms: {
                        u_offset: {
                            type: "uniform2fv",
                            value: ChartMath.vec2(a / 2, 0)
                        },
                        diffuse: {
                            type: "uniform3fv",
                            value: ChartMath.color(Math.random(), a, a)
                        }
                    }
                } )

                let mesh = new GLEngine.Mesh( {
                    geometry: geometry,
                    material: material
                } )

                mesh.position.x = a * 10
                mesh.position.y = 100

                window.mesh = mesh

                boxGroup.addChild( mesh )
            }

            glengine.addChild(boxGroup)

            let line = new GLEngine.Line( {
                points: [
                    { x: 0 * 10,  y:  0 * 10 },
                    { x: 1 * 10,  y:  1 * 10 },
                    { x: 2 * 10,  y:  0 * 10 },
                    { x: 3 * 10,  y:  2 * 10 },
                    { x: 4 * 10,  y:  0 * 10 },
                    { x: 5 * 10,  y:  3 * 10 },
                    { x: 6 * 10,  y:  0 * 10 },
                    { x: 7 * 10,  y:  5 * 10 },
                    { x: 8 * 10,  y:  0 * 10 },
                    { x: 9 * 10,  y:  6 * 10 },
                    { x: 10 * 10, y:  0 * 10 },
                    { x: 11 * 10, y:  8 * 10 },
                ],
                uniforms: {
                    diffuse: {
                        type: "uniform3fv",
                        value: ChartMath.color(1, 0.7, 0.5, 1)
                    },
                    thickness: {
                        type: "uniform1f",
                        value: ChartMath.float32( 3 )
                    }
                }
            } )

            window.line = line

            // glengine.setViewport( 0, 0, 400, 400 )

            glengine.addChild( line )

            MainLoop.addTask( glengine.render )
        } 

    }

    createCharts (chartsCount) {
        Utils.loop(0, chartsCount, 1, true, (a)=>{

            setTimeout(()=>{
                this.addTelechart(
                    ((a % rowSize) * (windowWidth / rowSize)) + padding,
                    (Math.floor(a / rowSize) * (windowHeight / rowSize)) + padding,
                    (windowWidth / rowSize) - padding,
                    (windowHeight / rowSize) - padding
                );
            }, a * 0)
            

        }, this);
    }


    addTelechart ( posX, posY, sizeX, sizeY ) {
        let telechart = new Telechart();
        telechart.update(chartData)

        this.telecharts.push(telechart);
        window[`telechart${(this.telecharts.length - 1)}`] = telechart;

        this.xframes.create({
            id: telechart.UUID,
            name: telechart.UUID,
            position: {
                x: posX,
                y: posY
            },
            size: {
                x: sizeX,
                y: sizeY
            },
            onCreate: (xframe)=>{
                telechart.setParentElement( xframe.bodyElement )
                this.setupCustomControls(xframe, telechart);
            },
            onClose: ()=>{
                this.xframes.remove(telechart.UUID);
                this.removeTelechart(telechart.UUID);
            },
            onFocus: ()=>{
                this.xframes.setFocus(telechart.UUID);
            }
        });
    }

    stopRendering () {
        Utils.loopCollection( this.telecharts, ( telechart, index )=>{
            telechart.stopRendering()
        } )
    }

    startRendering () {
        Utils.loopCollection( this.telecharts, ( telechart, index )=>{
            telechart.startRendering()
        } )
    }

    removeTelechart (uuid) {
        Utils.loopCollection(this.telecharts, (telechart, index)=>{
            if (telechart.UUID == uuid) {
                this.telecharts[index].stopRendering()
                this.telecharts.splice(index, 1);
                // this.telecharts = Helpers.trimList(this.telecharts)
                delete window[`telechart${index}`]
                return true;
            }
        });
    }

    removeAll () {
        while ( this.telecharts.length ) {
            delete window[ `telechart${this.telecharts.length - 1}` ]
            let telechart = this.telecharts.pop()
            this.xframes.remove( telechart.UUID );
            // telechart.die();
        }
    }

    setupCustomControls (xframe, telechart) {
        xframe.addCustomButton( "palette", {
            onClick: function () {
                telechart.setSkin( prompt( "Enter skin name (day, night...)" ) )
            }
        }, "setting skin");

        xframe.addCustomButton( "pause_circle_filled", {
            onClick: function () {
                if ( telechart.$state.renderingPaused ) {
                    telechart.startRendering()
                } else {
                    telechart.stopRendering()
                }
            }
        }, "start/stop rendering");


        xframe.addCustomButton( "skip_next", {
            onClick: function () {
                Tweener.tween( {
                    fromValue: telechart.$modules.majorPlot.$modules.renderingEngine.position.x,
                    toValue: prompt("Enter position (Number)"),
                    duration: 2000,
                    ease: "easeInQuad",
                    onUpdate: ( value, completed )=>{
                        telechart.$modules.majorPlot.$modules.renderingEngine.position.x = value
                        telechart.$modules.majorPlot.$modules.renderingEngine.updateProjection()
                    }
                } ) 
            }
        }, "move to position");
    }
}



export default App;