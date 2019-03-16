// import Telechart from "Telechart/Telechart"
// import chartData from "chart_data.json"

// let isMobile = ( "ontouchstart" in window ) 
// let chartsCount = isMobile ? 1 : 3

// console.log( chartData )

// for ( var a = 0; a < chartsCount; a++ ){
// 	let telechart = window[`telechart${a}`] = new Telechart();
// 	telechart.setParentElement( document.body )
// 	telechart.update( chartData )
// }


// if ( isMobile ) {
// 	 document.body.classList.add("mobile")
// }


import App from "App"

window.app = new App()