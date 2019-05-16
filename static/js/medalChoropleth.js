let svgMap = d3.select("#map")
    .append('svg')
    .classed("svg-content", true);
let mapWidth = 600,
    mapHeight = 400;
let medalData =[];
let year = 2008;


let projection = d3.geoNaturalEarth()
    .scale(mapWidth / 2 / Math.PI)
    .translate([mapWidth / 2, mapHeight / 2])
let path = d3.geoPath()
    .projection(projection);

// Data and color scale
let data = d3.map();
let colorScheme = d3.schemeReds[6];
colorScheme.unshift("#eee")
let colorScale = d3.scaleThreshold()
    .domain([1, 6, 11, 26, 101, 1001])
    .range(colorScheme);

// Legend
let g = svgMap.append("g")
    .attr("class", "legendThreshold")
    .attr("transform", "translate(20,20)");
g.append("text")
    .attr("class", "caption")
    .attr("x", 0)
    .attr("y", -6)
    .text("Students");
let labels = ['0', '1-5', '6-10', '11-25', '26-100', '101-1000', '> 1000'];
let legend = d3.legendColor()
    .labels(function (d) { return labels[d.i]; })
    .shapePadding(4)
    .scale(colorScale);

svgMap.select(".legendThreshold")
    .call(legend);

year = parseInt(year) || '1896';
url = `/medals/all/${year}`;

$.get(url, function(data) {
    if (data) {
        medalData = JSON.parse(data);
        d3.queue()
            .defer(d3.json, "http://enjalot.github.io/wwsd/data/world/world-110m.geojson")
            .await(ready);
    }
});

function ready(error, topo) {
    if (error) throw error;
    let mydata = [];
            let mydata2 = [];
    svgMap
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
            else{
                console.log(d)
            }
            // Set the color
            return colorScale(d.total);
        })
        .attr("d", path)
        .on("mouseover", function(d) {
        })
        .on("mouseout", function(d) {

        })
        .on("click", function (d) {
            plotMedalBar();
        });

         console.log(mydata)
            console.log(mydata2)

}


let plotMedalBar = ()=>{

};
