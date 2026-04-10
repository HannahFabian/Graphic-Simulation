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

var flag = true;

var g = d3.select("#chart-area")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var x = d3.scaleBand()
	.range([0, width])
	.padding(0.2);

var y = d3.scaleLinear()
	.range([height, 0]);


var xAxisCall = d3.axisBottom(x);
var yAxisCall = d3.axisLeft(y)
	.ticks(5)
	.tickFormat(d => "$" + d3.format(".2s")(d));


var xAxisGroup = g.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0, " + height + ")");

var yAxisGroup = g.append("g")
	.attr("class", "y axis");

// Labels
g.append("text")
	.attr("class", "x-axis-label")
	.attr("x", width / 2)
	.attr("y", height + 140)
	.attr("text-anchor", "middle")
	.text("Month");

var yLabel = g.append("text")
	.attr("class", "y-axis-label")
	.attr("x", -(height / 2))
	.attr("y", -60)
	.attr("transform", "rotate(-90)")
	.attr("text-anchor", "middle")
	.text("Revenue (dlls)");

// Load
d3.json("data/revenues.json").then((data) => {

	data.forEach(d => {
		d.revenue = +d.revenue;
		d.profit = +d.profit;
	});

	d3.interval(() => {
		update(data);
		flag = !flag;
	}, 1000);

}).catch((error)=> {
	console.log(error);
});


function update(data){

	var value = flag ? "revenue" : "profit";
	yLabel.text(value === "revenue" ? "Revenue (dlls)" : "Profit (dlls)");

	x.domain(data.map((d) => { return d.month; }));
	y.domain([0, d3.max(data, function(d) { return d[value] })]);

	// Join
	var bars = g.selectAll("rect").data(data);

	//Exit
	bars.exit().remove();

	//Update
	bars
		.attr("x", (d) => { return x(d.month); })
		.attr("y", (d) => { return y(d[value]); })
		.attr("width", x.bandwidth())
		.attr("height",(d) => { return height - y(d[value]); });

	// Enter
	bars.enter().append("rect")
		.attr("x", (d) => { return x(d.month); })
		.attr("y", (d) => { return y(d[value]); })
		.attr("width", x.bandwidth()) 
		.attr("height", (d) => { return height - y(d[value]); })
		.attr("fill", "olive");

	xAxisGroup.call(xAxisCall);
	yAxisGroup.call(yAxisCall);
}