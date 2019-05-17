console.log("JS Loaded");
var bubbleSVG,svgMap,centrSVG, current_selection;
var globalTransition;

$(function() {

    current_selection = document.getElementsByClassName("current-selection");
    if(current_selection.length>0){
        current_selection=current_selection[0]
        current_selection.innerText = 'Year: '+yearSelected
    }


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

	init_gender_scatter(centrSVG,'Regions',yearSelected,'USA','Summer');
//	init_gender_scatter(centrSVG,'Years',yearSelected,'USA');
//	init_bmi_scatter(centrSVG, yearSelected);
});


//UPDATE ALL MAPS
let updateMaps = (year) => {
    if(year == yearSelected){
        return
    }

    yearSelected = year;
	init_participation_bubble(bubbleSVG, yearSelected, init_participation_bar);
	update_medal_choropleth(yearSelected);
//	init_bmi_scatter(centrSVG, year);
    init_gender_scatter(centrSVG,'Regions',yearSelected,'USA','Summer');
	globalTransition = d3.transition().duration(750);

    if(current_selection){
        current_selection.innerText = 'Year: '+yearSelected
    }

}
