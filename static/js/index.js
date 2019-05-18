console.log("JS Loaded");
var bubbleSVG,svgMap,centrSVG;
var globalTransition;
var season;

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

	init_gender_scatter(centrSVG,'Regions',yearSelected,'USA');
//	init_gender_scatter(centrSVG,'Years',yearSelected,'USA');
//	init_bmi_scatter(centrSVG, yearSelected);

	$(".dropdown-item").on('click', function(e) {
		$('.active').removeClass('active');
		$(this).addClass('active');
		season = ($(this).text()).trim();
		$("#dropdownMenuButton").text(season);
		createTimeline(true);
	});
});


//UPDATE ALL MAPS
let updateMaps = (year) => {
    yearSelected = year;
	init_participation_bubble(bubbleSVG, yearSelected, init_participation_bar);
	update_medal_choropleth(yearSelected);
//	init_bmi_scatter(centrSVG, year);
    init_gender_scatter(centrSVG,'Regions',yearSelected,'USA');
	globalTransition = d3.transition().duration(750);

    $(".current-selection").text('Year: ' + yearSelected);
}
