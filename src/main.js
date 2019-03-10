import Telechart from "Telechart/Telechart"
import chartData from "chart_data.json"

let chartsCount = 10

console.log(chartData)

for ( var a = 0; a < chartsCount; a++ ){
	let telechart = window[`telechart${a}`] = new Telechart();
	document.body.appendChild(telechart.domElement);
	telechart.update(chartData)
}


