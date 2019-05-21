let mapSVG,medalData=[], topo, colorScale, path;

let init_medal_choropleth = (svg, year)=>{
    svg.selectAll("*").remove()
    mapSVG = svg;
    let mapWidth = parseInt(mapSVG.style('width'))
		mapHeight = parseInt(mapSVG.style('height'));

	let projection = d3.geoNaturalEarth()
						.scale(mapWidth / 2 / Math.PI)
						.translate([mapWidth / 2, mapHeight / 2])
	path = d3.geoPath()
				.projection(projection);

	// Data and color scale
	let colorScheme = d3.schemeReds[8];
	if(!colorScale){
	    colorScheme.unshift("#eee")
	}

	colorScale = d3.scaleThreshold()
						.domain([1, 6, 16, 31,51,101,301,501])
						.range(colorScheme);

	// Legend
	let g = mapSVG.append("g")
					.attr("class", "legendThreshold")
					.attr("transform", "translate(20,20)");
	g.append("text")
		.attr("class", "caption")
		.attr("x", 0)
		.attr("y", -6)
		.text("Medals");
	let labels = ['0', '1-5', '6-15', '16-30', '31-50', '51-100', '101-300','301-500','> 500'];
	let legend = d3.legendColor()
					.labels(function (d) { return labels[d.i]; })
					.shapePadding(4)
					.scale(colorScale);

	mapSVG.select(".legendThreshold")
			.call(legend);

	if(typeof year == "function"){
        year = yearSelected;
    }

    d3.queue()
		.defer(d3.json, "/static/js/world-110m.geojson")
		.defer(returnYear,year)
		.await(ready);
}

let update_medal_choropleth = (year,clear = false)=>{
    year = parseInt(year) || '1896';
    url = `/medals/all/${year}/${season}`;
	$.get(url, function(data) {
		if (data) {
			medalData = JSON.parse(data);
			d3.selectAll(".countries").remove()
			d3.selectAll(".path").remove()
			 mapSVG
                .append("g")
                .attr("class", "countries")
                .selectAll("path")
                .data(topo.features)
                .enter().append("path")
                .attr("fill", function (d){
                    // Pull data for this country
                    d.total = 0;
                    if(d.id in medalData){
                        d.total = medalData[d.id]
                    }
                    else if(d.properties.name in medalData){
                        d.total = medalData[d.properties.name];
                    }
                    // Set the color
                    return colorScale(d.total);
                })
                .attr("d", path)
                .on("mouseover", function(d) {
                console.log("d",d);
                    mapSVG.append("text")
                        .attr('class', 'val')
                        .attr('x', function() {
                            return 200
                        })
                        .attr('y', function() {
                            return 260
                        })
                        .text(function() {
                            return d.properties.name +":"+d.total
                        })
            })
                .on("mouseout", function(d) {
                    mapSVG.selectAll(".val")
                    .remove();
                })
                .on("click", function (d) {
                    updateCountry(d.id, d.properties.name);
                });
		}
	});
}

let ready = (error, topoResult,year)=> {
	if (error) throw error;
    topo = topoResult;
    update_medal_choropleth(year);
}

let returnYear = function(year,callback){
    callback(null,year);
}
