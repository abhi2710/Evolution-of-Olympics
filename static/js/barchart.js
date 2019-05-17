function init_participation_bar(svg, country, type, on_click_callbk) {
	setTimeout(() => {
		show_participation_bar(svg, country, on_click_callbk);
	}, 0);
}

function show_participation_bar(svg, country, on_click_callbk) {
	let url = `/participation/${country}`;
	svg.selectAll("*").remove();

	let width = parseInt(svg.style('width')) - 2*margin,
		height = parseInt(svg.style('height')) - 2*margin,
		x_label = "Years",
		y_label = "Participation Count",
		title = `Participation of ${country} over the years`;

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
	// label for y-axis
	svg.append('text')
		.attr('x', -(height / 2) - margin)
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

	if (on_click_callbk) {
		svg.datum({
			'svg': svg,
			'callbk': on_click_callbk,
			'on_click_callbk': init_participation_bar	
		}).on('click', function(d) {
			d['svg'].on('click', null);
			d['callbk'](svg, d['on_click_callbk']);
		});
	}
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
            .attr('transform', `translate(0, 10) rotate(15)`);

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
            .style('fill', 'steelblue');

        bars.select('text')
            .data(data)
            .enter()
            .append('text')
            .attr('x', s => xScale(s.Year))
            .attr('y', s => yScale(s.Count) - 15)
            .attr('class', (d, i) => {return `hide label${i}`})
            .text(s => s.Count);

        chart.selectAll('rect')
            .on('mouseover', highlight_bar)
            .on('mouseout', revert_highlight);

}

function highlight_bar(data, index) {
    change_bar_dimension(d3.select(this), 'orange', data, -5, -15, 10, 15);

    d3.select('.label' + index)
        .transition()
        .duration(400)
        .attr('class', 'show label' + index);
}

function revert_highlight(data, index) {
    change_bar_dimension(d3.select(this), 'steelblue', data);

    d3.select('.label' + index)
        .transition()
        .duration(400)
        .attr('class', 'hide label' + index);
}

function change_bar_dimension(cbar, color, data, nx =0, ny =0, nwidth =0, nheight =0) {
    /*
        :input types:
            cbar -> variable referencing to the bar on which event was called
            nx -> new value of x for the bar
            ny -> new value of y for the bar
            nwidth -> new value of width for the bar
            nheight -> new value of height for the bar
            color -> color to fill in the bar
            data -> bar data received by the event
     */

    cbar.transition()
        .duration(200)
        .style('fill', color)
        .attr('x', data.x + nx)
        .attr('y', data.y + ny)
        .attr('width', data.width + nwidth)
        .attr('height', data.height + nheight);

    return cbar;
}
