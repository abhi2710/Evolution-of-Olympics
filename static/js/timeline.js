let minYear = 1896,
	maxYear = 2016,
	timelineWidth = 1000,
	timelineHeight = 100,
	mapHeight = 600,
	mapWidth = 1000,
	margin = {right: 50, left: 50},
	width = +timelineWidth - margin.left - margin.right,
	height = +timelineHeight;
let tickValues = [];

for(let i=minYear;i<=2016;i+=4){
	tickValues.push(i);
}

let svg = d3.select("#timeline")
    .append('svg')
    .attr('height',height)
    .attr('width',timelineWidth);

let x = d3.scaleLinear()
    .domain([tickValues[0], tickValues[tickValues.length-1]])
    .range([0, width])
    .clamp(true);

let slider = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + "," + height / 2 + ")")
    .attr('width',width);


slider.append("line")
    .attr("class", "track")
    .attr("x1", x.range()[0])
    .attr("x2", x.range()[1])
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3.drag()
        .on("start.interrupt", function() { slider.interrupt(); })
        .on("start drag", function() {
        hue(x.invert(d3.event.x));
        }));

slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
  .selectAll("text")
  .data(tickValues)
  .enter().append("text")
    .attr("x", x)
    .attr("text-anchor", "middle")
    .text(function(d) { return d; });

let handle = slider.insert("svg:image",".track-overlay")
.attr("class", "handle")
.attr('x', -9)
.attr('y', -20)
.attr('width', 20)
.attr('height', 24)
.attr("xlink:href", "static/athlete.svg")


console.log("h",handle);

slider.transition()
    .duration(750)
    .tween("hue", function() {
      var i = d3.interpolate(0, 70);
      return function(t) { hue(i(t)); };
    });

function hue(h) {
    handle.attr("x", x(h));
    svg.style("background-color", d3.hsl(0.8, 0.8, 0.8));
}


let plotMap = function(){
    handle.attr("x", x(h));
    svg.style("background-color", d3.hsl(h, 0.8, 0.8));
}













let svgMAP = d3.select("#map")
    .append('svg')
    .attr('height',mapHeight)
    .attr('width',mapWidth);


let projection = d3.geoMercator();

let path = d3.geoPath().projection(projection);
d3.json("https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/world-50m.json", function(error, world) {
  if (error) throw error;
  svgMAP.insert("path", ".graticule")
      .datum(topojson.feature(world, world.objects.land))
      .attr("class", "land")
      .attr("d", path);

    let data = [{lat:10,lon:12,population:12},{lat:10,lon:80,population:10000},{lat:40,lon:40,population:1222}];

    svgMAP.selectAll('circle')
               .data(data)
               .enter().append('circle')
               .attr('cx', function(d) {
                        return projection([d.lon, d.lat])[0];
                 })
               .attr('cy', function(d) {
                    return projection([d.lon, d.lat])[1];
               })
               .attr('r', function(d) {
                    return Math.sqrt(parseInt(d.population));
                 })
               .style('fill', 'yellow')
               .style('opacity', 0.75);

});






