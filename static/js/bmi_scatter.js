function init_bmi_scatter(svg, year) {
	setTimeout(() => {
		show_bmi_scatter(svg, year);
	}, 50);
}

function show_bmi_scatter(svg, year) {
	let url = `/scatter/bmi/${year}`;

	let width = parseInt(svg.style('width')) - 2*margin,
		height = parseInt(svg.style('height')) - 2*margin,
		x_label = "Age",
		y_label = "BMI",
		title = "Variation of BMI of athletes with Age (A measure of fitness)";

	$.get(url, (data) => {
		if (data) {
			data = JSON.parse(data);
            plot_bmi_scatter(
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
}

function plot_bmi_scatter(svg, data, width, height) {

	let chart, x, y;
	const xScale = d3.scaleLinear(),
		yScale = d3.scaleLinear();

	let domainX = [0, d3.max(data.map(d => d.Age)) * 1.10];
	let domainY = [0, d3.max(data.map(d => d.bmi)) * 1.10];

	yScale.range([height, 0]).domain(domainY);
	xScale.range([0, width]).domain(domainX);

	if (svg.select('g#chart').empty()) {
		chart = svg.append('g')
			.attr('id', 'chart')
			.attr('transform', `translate(${margin},${margin})`);
		y = chart.append('g')
			.attr('class', 'yaxis')

		x = chart.append('g')
			.attr('class', 'xaxis')
			.attr('transform', `translate(0, ${height})`)


	} else {
		chart = svg.select('g#chart');
		chart.selectAll('.scatter_circle').exit()
			.transition(globalTransition)
			.attr("fill-opacity", 0.1)
			.attr("cy", yScale(0))
			.remove();

		x = chart.selectAll('.xaxis');
		y = chart.selectAll('.yaxis');
	}

	y.transition(globalTransition).call(d3.axisLeft(yScale));
	x.transition(globalTransition).call(d3.axisBottom(xScale));

	let count = 0;

	let circles = chart.selectAll()
		.data(data)
		.enter()
		.append('circle')
		.attr('class', 'scatter_circle')
		.attr('cx', s => xScale(s.Age))
		.attr('cy', s => yScale(s.bmi))
		.attr('r', 3.5)
		.style('opacity', 0.6)
		.style('fill', s => {
			count++;
			if (s.bmi < 18) {
				return 'skyblue';
			} else if (s.bmi > 29.9) {
				return 'red';
			} else if (s.bmi > 34.9) {
				return 'magenta';
			} else if (s.bmi > 24.9) {
				return 'orange';
			} else {
				return 'green';
			}
		});

	console.log(count);
	//bars.select('text')
	//.data(data)
	//.enter()
	//.append('text')
	//.attr('x', s => xScale(s.Year))
	//.attr('y', s => yScale(s.Count) - 15)
	//.attr('class', (d, i) => {return `hide label${i}`})
	//.text(s => s.Count);

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
       /* .attr('x', data.x + nx)*/
        //.attr('y', data.y + ny)
        //.attr('width', data.width + nwidth)
        //.attr('height', data.height + nheight);

    return cbar;
}
