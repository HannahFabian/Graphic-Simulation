/*
*    main.js
*/

var svg = d3.select("#chart-area").append("svg")
	.attr("width", 500)
	.attr("height", 500);

// I used "data/agesErrorHandling.json" to prove that the console
// said "Error loading file"
d3.json("data/ages.json").then((data)=> {

	data.forEach((d)=>{
		d.age = +d.age;
	});

	console.log(data);

	svg.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", (d, i) => (i * 80) + 40)
		.attr("cy", 100) 
		.attr("r", (d) => d.age * 2)
		.attr("fill", "blue");

})
.catch((error)=>{
    console.log("Error loading file:", error);
});