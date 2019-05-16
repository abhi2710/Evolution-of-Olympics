let minYear = 1896,
	maxYear = 1996,
	margin = {right: 50, left: 50};
let tickValues = [];

for(let i=minYear;i<=maxYear;i+=4){
	tickValues.push(i);
}

let svg = d3.select("#timeline")
    .append('svg')
    .classed("svg-content", true);


let timelineWidth = parseInt(svg.style("width")),
    timelineHeight = parseInt(svg.style("height"));
let width = +timelineWidth - margin.left - margin.right,
    height = +timelineHeight;

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

slider
    .insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
    .selectAll("text")
    .data(tickValues)
    .enter().append("text")
    .attr("x", x)
    .attr("text-anchor", "middle")
    .text(function(d) {return d;});

let handle = slider.insert("svg:image",".track-overlay")
.attr("class", "handle")
.attr('x', -9)
.attr('y', -20)
.attr('width', 20)
.attr('height', 24)
.attr("xlink:href", "static/athlete.svg")


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