var init_gender_scatter = function(svg, type, year, region){

    svg.selectAll('*').remove();

    let height = parseInt(svg.style("height")) - (margin),
        width = parseInt(svg.style("width")) - (margin*2)

    let xScale = d3.scaleBand()
		.range([0, width]);

	let yScale = d3.scaleLinear()
		.range([height, 0]);

	// square root scale.
	let radius = d3.scaleSqrt()
		.range([2,5]);

	// the axes are much cleaner and easier now. No need to rotate and orient the axis, just call axisBottom, axisLeft etc.
	let xAxis = d3.axisBottom()
		.scale(xScale);

	let yAxis = d3.axisLeft()
		.scale(yScale);

	// again scaleOrdinal
	let color = d3.scaleOrdinal(d3.schemeCategory20);

    let url = `/gender/${year}/regions/${region}`;
	$.get(url, function(data) {
		if (data) {
		    data = JSON.parse(data).data;
            let domainX = []
            data.forEach(function(d){
                domainX.push(type=="Years"?d.Year:d.Region);

            })
		    xScale.domain(domainX);

		    yScale.domain(d3.extent(data, function(d){
			    return d.Count;
		    })).nice();

		    radius.domain(d3.extent(data, function(d){
			    return d.Count;
		    })).nice();


		    svg.append('g')
			.attr('transform', 'translate('+margin+',' + height + ')')
			.attr('class', 'x axis')
			.call(xAxis);

            // y-axis is translated to (0,0)
            svg.append('g')
                .attr('transform', 'translate('+margin+',0)')
                .attr('class', 'y axis')
                .call(yAxis);

            let bubble = svg.selectAll('.bubble')
                .data(data)
                .enter().append('circle')
                .attr('class', 'bubble')
                .attr('cx', function(d){
                    console.log("dd",d,type=="Years"?d.Year:d.Region,xScale(type=="Years"?d.Year:d.Region));
                    return xScale(type=="Years"?d.Year:d.Region);
                    })
                .attr('cy', function(d){ return yScale(d.Count); })
                .attr('r', function(d){ return radius(d.Count); })
                .style('fill', function(d){ return color(d.Sex); });

            bubble.append('title')
                .attr('x', function(d){ return radius(d.Count); })
                .text(function(d){
                    return d.Count;
                });


            svg.append('text')
                .attr('x', 10)
                .attr('y', height/2)
                .attr('class', 'label')
//                .attr('transform', 'rotate(-90)')
                .text('Count');


            svg.append('text')
                .attr('x', width)
                .attr('y', height - 10)
                .attr('text-anchor', 'end')
                .attr('class', 'label')
                .text(type);

		}
	})

}