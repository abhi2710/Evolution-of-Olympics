let minYear = 1896,
	maxYear = 1996,
    tickValues = [];

var yearSelected = minYear;

for(let i=minYear;i<=maxYear;i+=4){
	tickValues.push(i);
}

let timelineSVG = d3.select("#timeline")
    .append('svg')
    .classed("timeline-svg", true);


let timelineWidth = parseInt(timelineSVG.style("width")),
    timelineHeight = parseInt(timelineSVG.style("height"));
let width = +timelineWidth - margin - margin,
    height = +timelineHeight;

let x = d3.scaleLinear()
    .domain([tickValues[0], tickValues[tickValues.length-1]])
    .range([0, width])
    .clamp(true);

let slider = timelineSVG.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + margin + "," + height / 2 + ")")
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
        console.log("year",x.invert(d3.event.x));
        yearSelected = x.invert(d3.event.x)
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
.attr('x', -2)
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
}
