/*
*    main.js
*/
var svg = d3.select("#chart-area").append("svg")
	.attr("width", 400)
	.attr("height", 600);

d3.json("data/buildings.json").then((data) => {
	console.log(data);

	data.forEach(d => {
		d.height = +d.height;
	});

	svg.selectAll("rect")
		.data(data)
		.enter()
		.append("rect")
		.attr("x", (d, i) => i * 80)
		.attr("y", (d) => 500 - (d.height * 0.8))
		.attr("width", 60)
		.attr("height", (d) => d.height * 0.8)
		.attr("fill", "purple");
})
