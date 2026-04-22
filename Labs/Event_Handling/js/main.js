/*
*    main.js
*/

var margin = { top: 50, right: 150, bottom: 50, left: 80 };
var width = 800 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

// SVG
var svg = d3.select("#chart-area")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

// Axes
var xAxisGroup = svg.append("g")
	.attr("transform", "translate(0, " + height + ")");

var yAxisGroup = svg.append("g");

// Labels
// Income label
svg.append("text")
	.attr("x", width / 2)
	.attr("y", height + 40)
	.attr("text-anchor", "middle")
	.text("Income ($)");

// Life expectancy label
svg.append("text")
	.attr("x", -(height / 2))
	.attr("y", -50)
	.attr("transform", "rotate(-90)")
	.attr("text-anchor", "middle")
	.text("Life Expectancy");

// Year label
var yearLabel = svg.append("text")
	.attr("x", width - 10)
	.attr("y", height - 10)
	.attr("text-anchor", "end")
	.attr("font-size", "40px")
	.attr("opacity", 0.4);

// Load data
d3.json("data/data.json").then(function(data){

	// Clean data
	var formattedData = data.map(function(year){
		return year.countries
			.filter(function(d){
				return d.income && d.life_exp;
			})
			.map(function(d){
				return {
					country: d.country,
					income: +d.income,
					life_exp: +d.life_exp,
					population: +d.population,
					continent: d.continent
				};
			});
	});

	var continents = [];

	data[0].countries.forEach(function(d){
		if (continents.indexOf(d.continent) === -1){
			continents.push(d.continent);
		}
	});

	// Scales
	var xScale = d3.scaleLog()
		.domain([142, 150000])
		.range([0, width]);

	var yScale = d3.scaleLinear()
		.domain([0, 90])
		.range([height, 0]);

	var areaScale = d3.scaleLinear()
		.domain([2000, 1400000000])
		.range([25 * Math.PI, 1500 * Math.PI]);

	var colorScale = d3.scaleOrdinal()
		.domain(continents)
		.range(d3.schemePastel1);

	// Axes
	var xAxis = d3.axisBottom(xScale)
		.tickValues([400, 4000, 40000])
		.tickFormat(d3.format("$,"));

	var yAxis = d3.axisLeft(yScale);

	xAxisGroup.call(xAxis);
	yAxisGroup.call(yAxis);

	// Countries labels
	var legend = svg.append("g")
		.attr("transform", "translate(" + (width + 20) + ", 20)");

	continents.forEach(function(continent, i){
		var row = legend.append("g")
			.attr("transform", "translate(0, " + (i * 20) + ")");

		row.append("rect")
			.attr("width", 10)
			.attr("height", 10)
			.attr("fill", colorScale(continent));

		row.append("text")
			.attr("x", 15)
			.attr("y", 10)
			.text(continent);
	});

	// Controls
	// Dropdown
	var continentSelect = document.getElementById("continent-select");
	continents.forEach(function(continent){
		var option = document.createElement("option");
		option.value = continent;
		option.textContent = continent;
		continentSelect.appendChild(option);
	});

	// Year slider
	var slider = document.getElementById("year-slider");
	slider.min = 0;
	slider.max = formattedData.length - 1;
	slider.value = 0;

	// State
	var yearIndex = 0;
	var isPlaying = true;
	var selectedContinent = "all";
	var intervalId = null;

	// Update function
	function update(dataYear, year){

		yearLabel.text(year);

		var filteredData = selectedContinent === "all"
			? dataYear
			: dataYear.filter(function(d){ return d.continent === selectedContinent; });

		slider.value = yearIndex;

		// 1. JOIN
		var circles = svg.selectAll("circle")
			.data(filteredData, function(d){ return d.country; });

		// 2. EXIT
		circles.exit()
			.attr("r", 0)
			.remove();

		// 3. UPDATE
		circles
			.attr("cx", function(d){ return xScale(d.income); })
			.attr("cy", function(d){ return yScale(d.life_exp); })
			.attr("r", function(d){
				return Math.sqrt(areaScale(d.population) / Math.PI);
			});

		// 4. ENTER
		circles.enter()
			.append("circle")
			.attr("cx", function(d){ return xScale(d.income); })
			.attr("cy", function(d){ return yScale(d.life_exp); })
			.attr("r", function(d){
				return Math.sqrt(areaScale(d.population) / Math.PI);
			})
			.attr("fill", function(d){ return colorScale(d.continent); });
	}

	function step(){
		update(formattedData[yearIndex], data[yearIndex].year);
		yearIndex++;
		if (yearIndex >= formattedData.length){
			yearIndex = 0;
		}
	}

	function startInterval(){
		if (!intervalId){
			intervalId = setInterval(step, 1000);
		}
	}

	function stopInterval(){
		if (intervalId){
			clearInterval(intervalId);
			intervalId = null;
		}
	}

	// Play and Pause
	var playPauseBtn = document.getElementById("play-pause-btn");

	playPauseBtn.addEventListener("click", function(){
		isPlaying = !isPlaying;
		if (isPlaying){
			playPauseBtn.textContent = "Pause";
			startInterval();
		} else {
			playPauseBtn.textContent = "Play";
			stopInterval();
		}
	});

	// Reset
	document.getElementById("reset-btn").addEventListener("click", function(){
		yearIndex = 0;
		update(formattedData[yearIndex], data[yearIndex].year);
		if (!isPlaying){
			isPlaying = true;
			playPauseBtn.textContent = "Pause";
		}
		stopInterval();
		startInterval();
	});

	// Year slider 
	slider.addEventListener("input", function(){
		stopInterval();
		isPlaying = false;
		playPauseBtn.textContent = "Play";

		yearIndex = +this.value;
		update(formattedData[yearIndex], data[yearIndex].year);
	});

	// Dropdown
	continentSelect.addEventListener("change", function(){
		selectedContinent = this.value;
		update(formattedData[yearIndex], data[yearIndex].year);
	});

	update(formattedData[yearIndex], data[yearIndex].year);
	startInterval();

});