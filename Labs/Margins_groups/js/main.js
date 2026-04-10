/*
*    main.js
*/

const width = 600;
const height = 400;

const margin = {
	left: 100,
	right: 10,
	top: 10,
	bottom: 100
};

// Used to define the area that I can use, subtracting the margins from the canvas area.
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

var svg = d3.select("#chart-area").append("svg")
	.attr("width", width)
	.attr("height", height);

// I don't have to calculate all the margins manually, using a group.
var groupAcanvas = svg.append("g")
	.attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.json("data/buildings.json").then((data) => {

	data.forEach(d => {
		d.height = +d.height;
	});

	// X Scale
	const x = d3.scaleBand()
		.domain(data.map(d => d.name))
		.range([0, innerWidth])
		.paddingInner(0.3)
		.paddingOuter(0.3);

	// Y Scale
	const y = d3.scaleLinear()
		.domain([0, d3.max(data, d => d.height)])
		.range([innerHeight, 0]);

	// Colors
	const color = d3.scaleOrdinal(d3.schemeSet3);

	// Bars
	groupAcanvas.selectAll("rect")
		.data(data)
		.enter()
		.append("rect")
		.attr("x", d => x(d.name))
		.attr("y", d => y(d.height))
		.attr("width", x.bandwidth())
		.attr("height", d => innerHeight - y(d.height))
		.attr("fill", d => color(d.name));

	// For X axis
	const axisX = d3.axisBottom(x);

	groupAcanvas.append("g")
		.attr("class", "x-axis")
		.attr("transform", `translate(0, ${innerHeight})`)
		.call(axisX)
		.selectAll("text")
		.attr("x", -5)
		.attr("y", 10)
		.attr("transform", "rotate(-40)")
		.style("text-anchor", "end");

	// For Y axis
	const axisY = d3.axisLeft(y)
		.ticks(5)
		.tickFormat(d => d + " m");

	groupAcanvas.append("g")
		.attr("class", "y-axis")
		.call(axisY);

	groupAcanvas.append("text")
		.attr("class", "x-axis-label")
		.attr("x", innerWidth / 2)
		.attr("y", innerHeight + 140)
		.attr("text-anchor", "middle")
		.text("Tallest buildings in the world :D");

	groupAcanvas.append("text")
		.attr("class", "y-axis-label")
		.attr("x", -(innerHeight / 2))
		.attr("y", -60)
		.attr("transform", "rotate(-90)")
		.attr("text-anchor", "middle")
		.text("Height (m)");
});