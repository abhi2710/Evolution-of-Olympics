console.log("JS Loaded");
var bubbleSVG,svgMap,centrSVG, current_selection,current_country_selection;
var globalTransition,countrySelected,nocSelected;
var season, showBars = false;
var current_center_plot = init_gender_scatter;

$(function() {
	$(".current-selection").text('Year: ' + yearSelected);
	season = $("#dropdownMenuButton").text().trim();
	createTimeline();
	bubbleSVG = d3.select("#bubble-chart")
		.append('svg')
		.classed('svg-content', true);
	svgMap = d3.select("#map")
		.append('svg')
		.classed("svg-content", true);

	centrSVG = d3.select("#center-card")
		.append('svg')
		.classed("svg-content", true);

	init_medal_choropleth(svgMap, yearSelected, init_participation_bar);
	init_participation_bubble(bubbleSVG, yearSelected, init_participation_bar);

	current_center_plot(centrSVG, yearSelected);
	//	current_center_plot(centrSVG,'Years',yearSelected,'USA');
	//	init_bmi_scatter(centrSVG, yearSelected);

	$(".dropdown-item").on('click', function(e) {
		if(!$(this).hasClass('active')) {
			$('button.active').removeClass('active');
			$(this).addClass('active');
			season = ($(this).text()).trim();
			$("#dropdownMenuButton").text(season);
			createTimeline(true);
		}
	});

});

function update_active(self) {
	console.log(self);
	$('li.active').removeClass('active');
	self.parent().addClass('active');
}

function setup_center_scatter(self, fn) {
	if ($(self).parent().hasClass('active')) {
		return true;
	}
	update_active($(self));
	centrSVG.selectAll("*").remove();
	current_center_plot = fn;
	current_center_plot(centrSVG, yearSelected)
}

//UPDATE ALL MAPS
let updateMaps = (year, update=true) => {
	showBars = false;
	yearSelected = year;
	init_participation_bubble(bubbleSVG, yearSelected, init_participation_bar);
	console.log("update",update)
	if(update){
		update_medal_choropleth(yearSelected);
	}
	else{
		init_medal_choropleth(svgMap, yearSelected, init_participation_bar);
	}

	//	init_bmi_scatter(centrSVG, year);
	current_center_plot(centrSVG, yearSelected);
	globalTransition = d3.transition().duration(750);

	$(".current-selection").text('Year: ' + yearSelected);
}

let updateCountry = (noc, country) => {
	showBars = true;

	countrySelected = country;
	nocSelected = noc;

   // init_sunburst(centrSVG,country);

    init_participation_bar(bubbleSVG, noc, 'participation', country, init_participation_bubble);
    init_participation_bar(mapSVG, noc, 'medals', country, init_medal_choropleth)

	current_center_plot(centrSVG, yearSelected);
	$(".current-selection").text('Country: ' + countrySelected);
}
