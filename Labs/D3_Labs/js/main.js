/*
*    main.js
*/
var svg = d3.select("#chart-area").append("svg")
	.attr("width", 400)
	.attr("height", 400);

var circle = svg.append("circle")
	.attr("cx", 100)
	.attr("cy", 250)
	.attr("r", 70)
	.attr("fill", "purple");

var rect = svg.append("rect")
	.attr("x", 100)
	.attr("y", 60)
	.attr("width", 100)
	.attr("height", 100)
	.attr("fill","green");

