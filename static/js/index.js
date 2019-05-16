console.log("JS Loaded");
let bubbleSVG;

$(function() {
	bubbleSVG = d3.select("#bubble-chart")
				.append('svg')
				.classed('svg-content', true);
	console.log("init");
	init_participation_bubble(bubbleSVG, yearSelected, init_participation_bar);
});


//UPDATE ALL MAPS
let updateMaps = (year)=>{
    if(year == yearSelected){
        return
    }
    yearSelected = year;
	console.log("update");
		init_participation_bubble(bubbleSVG, year, init_participation_bar);
}
