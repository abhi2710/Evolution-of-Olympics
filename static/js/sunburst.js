function init_sunburst(svg,region){

let width = parseInt(svg.style('width')) - 2*margin,
    height = parseInt(svg.style('height')) - 2*margin,
    radius = (Math.min(width, height)/2)-10;

let url = `/medals/games/${region}`;
$.get(url, function(data) {
	if (data) {
	    data = JSON.parse(data);
        plot_sunburst(
				svg,
				data,
				width,
				height,
				radius
			)
	    }
	});
}

function plot_sunburst(svg, data, width, height, radius){


let formatNumber = d3.format(",d");
let x = d3.scaleLinear()
    .range([0, 2 * Math.PI]);

let y = d3.scaleSqrt()
    .range([0, radius]);

let g = svg.append("g")
                    .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");

let color = d3.scaleOrdinal(d3.schemeCategory20);

let partition = d3.partition();
let arc = d3.arc()
    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x0))); })
    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x1))); })
    .innerRadius(function(d) { return Math.max(0, y(d.y0)); })
    .outerRadius(function(d) { return Math.max(0, y(d.y1)); });

  let root = d3.hierarchy(data);
  root.sum(function(d) { return d.size; });
  g.selectAll("path")
    .data(partition(root).descendants())
    .enter().append("path")
    .attr("d", arc)
    .style("fill", function(d) {
    return color((d.children ? d : d.parent).data.name); })
    .on("click", function (d) {
        svg.transition()
          .duration(750)
          .tween("scale", function() {
                let xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
                yd = d3.interpolate(y.domain(), [d.y0, 1]),
                yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius]);
                return function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); };
            })
            .selectAll("path")
            .attrTween("d", function(d) { return function() { return arc(d); }; });
    })
      .append("title")
      .text(function(d) { return d.data.name + "\n" + formatNumber(d.value); })
      .attr("x", function(d) {
             return y(d.y0);
       })
       .attr("y", function(d) {
             return x(d.x0);
          })
}
