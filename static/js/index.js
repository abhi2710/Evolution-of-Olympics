console.log("JS Loaded");

function calculate_year(year_idx) {
	let year;
	year_idx = parseInt(year_idx);
	if (year_idx < 7) {
		// oly summer games for the first 7 years
		year = 1896 + year_idx * 4;
	} else if (year_idx < 43) {
		// introduction of winter games
		year_idx -= 7;
		year = 1924 + Math.floor(year_idx/2) * 4;
	} else {
		// splitting of summer and winter games
		// two years apart now from 1994 onwards.
		year_idx -= 43;
		year = 1994 + year_idx * 2;
	}
	if (year === 1916 || year === 1940 || year === 1944) {
		return -1;
	} else if (year > 2016) {
		return -2;
	}
	return year;
}

$(function() {
	let season_slider  = $("#season-slider");
	let svg = d3.select("#bubble-chart")
				.append('svg')
				.classed('svg-content', true);

	console.log(svg);
	let year_idx = season_slider[0].value;

	season_slider.on('change', function () {
		console.log(this.value);
		let year = calculate_year(this.value);
		init_participation_bubble(svg, year, init_participation_bar);
	});

	let year = calculate_year(year_idx);
	init_participation_bubble(svg, year, init_participation_bar);

});
