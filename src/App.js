import XFrames from "XFrames"
import Utils from "Telechart/Utils"
import Telechart from "Telechart/Telechart"
import Tweener from "Telechart/Tweener"
import ChartMath from "Telechart/ChartMath"

import chartData from "chart_data.json"

let isMobile = !!('ontouchstart' in window || navigator.msMaxTouchPoints);
let chartsCount = isMobile ? 1 : 4
let padding = 16;
let rowSize = Math.ceil(Math.sqrt(chartsCount));
let windowWidth = window.innerWidth - ((rowSize + 1) * padding);
let windowHeight = window.innerHeight - ((rowSize + 1) * padding);


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