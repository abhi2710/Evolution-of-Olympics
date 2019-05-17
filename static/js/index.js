console.log("JS Loaded");
var bubbleSVG,svgMap,centrSVG;

$(function() {
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

	init_gender_scatter(centrSVG,'Regions',1896,'USA');
});


//UPDATE ALL MAPS
let updateMaps = (year) => {
    if(year == yearSelected){
        return
    }

    yearSelected = year;
	init_participation_bubble(bubbleSVG, yearSelected, init_participation_bar);
	update_medal_choropleth(yearSelected);
}
