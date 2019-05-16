let svgMap = d3.select("#map")
    .append('svg')
    .classed("svg-content", true);
let mapWidth = 600,
    mapHeight = 400;

// let hoverText = document.getElementById("hoverText");

// Map and projection
var path = d3.geoPath();
var projection = d3.geoNaturalEarth()
    .scale(mapWidth / 2 / Math.PI)
    .translate([mapWidth / 2, mapHeight / 2])
var path = d3.geoPath()
    .projection(projection);

// Data and color scale
var data = d3.map();
var colorScheme = d3.schemeReds[6];
colorScheme.unshift("#eee")
var colorScale = d3.scaleThreshold()
    .domain([1, 6, 11, 26, 101, 1001])
    .range(colorScheme);

// Legend
var g = svgMap.append("g")
    .attr("class", "legendThreshold")
    .attr("transform", "translate(20,20)");
g.append("text")
    .attr("class", "caption")
    .attr("x", 0)
    .attr("y", -6)
    .text("Students");
var labels = ['0', '1-5', '6-10', '11-25', '26-100', '101-1000', '> 1000'];
var legend = d3.legendColor()
    .labels(function (d) { return labels[d.i]; })
    .shapePadding(4)
    .scale(colorScale);

svgMap.select(".legendThreshold")
    .call(legend);

// Load external data and boot
d3.queue()
    .defer(d3.json, "http://enjalot.github.io/wwsd/data/world/world-110m.geojson")
    .defer(d3.csv, "/static/medalChoropleth.csv", function(d) { 
		data.set(d.code, +d.total); 
	})
    .await(ready);

function ready(error, topo) {
     console.log("topo",topo);
    if (error) throw error;

    // Draw the map
    svgMap
        .append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(topo.features)
        .enter().append("path")
        .attr("fill", function (d){
            // Pull data for this country
            d.total = data.get(d.id) || 0;
            // Set the color
            return colorScale(d.total);
        })
        .attr("d", path)
        .on("mouseover", function(d) {
            console.log("d",d)
        })
        .on("mouseout", function(d) {

        })
        .on("click", function (d) {
            plotMedalBar();
        });
}


let plotMedalBar = ()=>{

};
