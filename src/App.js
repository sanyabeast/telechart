import XFrames from "XFrames"
import Utils from "Telechart/Utils"
import Telechart from "Telechart/Telechart"

let isMobile = !!('ontouchstart' in window || navigator.msMaxTouchPoints);
let chartsCount = isMobile ? 1 : 1
let padding = 16;
let rowSize = Math.ceil(Math.sqrt(chartsCount));
let windowWidth = window.innerWidth - ((rowSize + 1) * padding);
let windowHeight = window.innerHeight - ((rowSize + 1) * padding);

if (isMobile){
    document.body.addEventListener("click", ()=>{
        try {
            document.body.webkitRequestFullScreen()
        } catch (err) {}

        try {
            document.body.requestFullScreen()
        } catch (err) {}
    })
}


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

    }

    createCharts (chartsCount) {
        Utils.loop(0, chartsCount, 1, false, (a)=>{

            setTimeout(()=>{
                this.addTelechart(
                    ((a % rowSize) * (windowWidth / rowSize)) + padding,
                    (Math.floor(a / rowSize) * (windowHeight / rowSize)) + padding,
                    (windowWidth / rowSize) - padding,
                    (windowHeight / rowSize) - padding
                );
            }, a * 350)
            

        }, this);
    }


    addTelechart ( posX, posY, sizeX, sizeY ) {
        let telechart = new Telechart();

        this.telecharts.push(telechart);
        window[`telechart${(this.telecharts.length - 1)}`] = telechart.$;

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

    removeTelechart (uuid) {
        Utils.loopCollection(this.telecharts, (telechart, index)=>{
            if (telechart.UUID == uuid) {
                this.telecharts.splice(index, 1);
                this.telecharts[index].stopRendering()
                // this.telecharts = Helpers.trimList(this.telecharts)
                delete window[`telechart${index}`]
                return true;
            }
        });
    }

    removeAll () {
        while (this.telecharts.length) {
            delete window[`telechart${this.telecharts.length - 1}`]
            let telechart = this.telecharts.pop()
            this.xframes.remove(telechart.UUID);
            // telechart.die();
        }
    }

    setupCustomControls (xframe, telechart) {
        /*centrizing*/
        xframe.addCustomButton("skip_next", {
            onClick: function () {
                telechart.centrize();
            }
        }, "Move to last point");
    }
}



export default App;