function init_participation_bar(svg, country, type, region, on_click_callbk) {
	setTimeout(() => {
		show_participation_bar(svg, country, type, region, on_click_callbk);
	}, 0);
}

function show_participation_bar(svg, country, type, region, on_click_callbk) {

	let url = `/${type}/${country}/${season}`;
	let text = 'Participations';

	if(type == 'medals'){
	    url = `/${type}/${country}/regions/${region}/${season}`;
	    text = 'Medals';
	}

	svg.selectAll("*").remove();

	let width = parseInt(svg.style('width')) - 2*margin,
		height = parseInt(svg.style('height')) - 2*margin,
		x_label = "Years",
		y_label = `${text} Count`,
		title = `${text} of ${country} over the years`;

	$.get(url, (data) => {
		if (data) {
			data = JSON.parse(data);
			plot_bar_chart(
				svg,
				data.data,
				width,
				height
			)
		}
	});
	//
	// label for y-axis
	svg.append('text')
		.attr('x', - (height / 2) - margin)
		.attr('y', margin / 3.4)
		.attr('transform', 'rotate(-90)')
		.attr('text-anchor', 'middle')
		.attr('class', 'labels')
		.text(y_label);

	// title
	svg.append('text')
		.attr('x', width / 2 + margin)
		.attr('y', 40)
		.attr('text-anchor', 'middle')
		.attr('class', 'title')
		.text(title);

	// label for x-axis
	svg.append('text')
		.attr('x', width / 2 + margin)
		.attr('y', 2*margin + height - 10) // - the overflow
		.attr('text-anchor', 'middle')
		.attr('class', 'labels')
		.text(x_label);

//	if (on_click_callbk) {
//		svg.datum({
//			'svg': svg,
//			'callbk': on_click_callbk,
//			'on_click_callbk': init_participation_bar,
//			''
//		}).on('click', function(d) {
//			d['svg'].on('click', null);
//			d['callbk'](svg, d['on_click_callbk']);
//		});
//	}
}


function plot_bar_chart(svg, data, width, height) {

        const chart = svg.append('g')
						.attr('id', 'chart')
						.attr('transform', `translate(${margin},${margin})`);

		const xScale = d3.scaleBand(),
			  yScale = d3.scaleLinear();

		let domainX = data.map(d => d.Year)
			domainY = [0, d3.max(data.map(d => d.Count)) * 1.10];

        yScale.range([height, 0]).domain(domainY);
        xScale.range([0, width]).domain(domainX).padding(0.2);

        let y = chart.append('g')
            .call(d3.axisLeft(yScale));

        let x = chart.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(xScale));

        x.selectAll('text')
            .attr('transform', `translate(0, 10) rotate(-45)`);

		let chart_data = [];
		data.forEach((d) => chart_data.push({
			'x': xScale(d.Year),
			'y': yScale(d.Count),
			'height': height - yScale(d.Count),
			'width': xScale.bandwidth()
		}));

        let bars = chart.selectAll()
            .data(chart_data)
            .enter()
            .append('rect')
            .attr('x', s => s.x)
            .attr('y', s => s.y)
            .attr('height', s => s.height)
            .attr('width', s => s.width)
            .style('fill', 'steelblue')
            .on("click", function (d) {
                    let eachBand = xScale.step();
                    let index = Math.round((d.x / eachBand));
                    let year = xScale.domain()[index];
                    updateMaps(year, false);
            });

//        bars.select('text')
//            .data(data)
//            .enter()
//            .append('text')
//            .attr('x', s => xScale(s.Year))
//            .attr('y', s => yScale(s.Count) - 15)
//            .attr('class', (d, i) => {return `hide label${i}`})
//            .text(s => s.Count);

        chart.selectAll('rect')
            .on('mouseover', function (d, i) {
            d3.select(this).attr('class', 'highlight');
            d3.select(this)
                .transition()     // adds animation
                .duration(400)
                .style('fill', 'orange')

            chart.append("text")
                .attr('class', 'val')
                .attr('x', function() {
                    return d.x - (xScale.bandwidth()/2)
                })
                .attr('y', function() {
                    return d.y - 15;
                })
                .text(function() {
                    return parseInt(yScale.invert(d.y));
                });
            })

            .on('mouseout', function (data, index) {
                d3.select(this)
                    .transition()     // adds animation
                    .duration(400)
                    .style('fill', 'steelblue')
                    chart.selectAll('.val')
                .remove()
})

}