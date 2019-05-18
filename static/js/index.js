console.log("JS Loaded");
var bubbleSVG,svgMap,centrSVG, current_selection,current_country_selection;
var globalTransition,countrySelected,nocSelected;
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
let updateMaps = (year, update=true) => {
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
    init_gender_scatter(centrSVG,'Regions',yearSelected,'USA');
	globalTransition = d3.transition().duration(750);

    $(".current-selection").text('Year: ' + yearSelected);
}

let updateCountry = (noc,country)=>{
    console.log("Country Updated",noc,country)
    if(country == countrySelected){
        return
    }
    countrySelected = country;
    nocSelected = noc;

    init_participation_bar(bubbleSVG, noc, 'participation', country, init_participation_bubble);
    init_participation_bar(mapSVG, noc, 'medals', country, init_medal_choropleth)

    if(false){//Current selected graph == genderRegion
        init_gender_scatter(centrSVG,'Years',yearSelected,'USA','Summer');
    }

    if(current_country_selection){
        current_country_selection.innerText = 'Region: '+countrySelected
    }
}
