import Telechart from "Telechart/Telechart"
import chartData from "chart_data.json"

let chartsCount = 1

console.log( chartData )

for ( var a = 0; a < chartsCount; a++ ){
	let telechart = window[`telechart${a}`] = new Telechart();
	telechart.setParentElement( document.body )
	telechart.update( chartData )
}


