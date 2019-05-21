function init_bmi_scatter(svg, year) {
	setTimeout(() => {
		show_bmi_scatter(svg, year);
	}, 50);
}

function show_bmi_scatter(svg, year) {
	let url = `/scatter/bmi/${year}/${season}`;
	if (showBars)
		url = `/scatter/bmi/${countrySelected}/${season}`;

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
			.attr('class', 'yaxis');

		x = chart.append('g')
			.attr('class', 'xaxis')
			.attr('transform', `translate(0, ${height})`);

	} else {
		chart = svg.select('g#chart');

		d3.selectAll('.scatter_circle')
			.transition(globalTransition)
			.attr('cy', yScale(0))
			.attr("fill-opacity", 0.1)
			.remove();

		x = chart.select('.xaxis');
		y = chart.select('.yaxis');
	}


	y.transition(globalTransition).call(d3.axisLeft(yScale));
	x.transition(globalTransition).call(d3.axisBottom(xScale));

	let count = 0;
	let circles = chart
					.selectAll()
					.data(data);

	circles
		.enter()
		.append('circle')
		.attr('class', 'scatter_circle')
		.attr('cx', s => xScale(s.Age))
		.attr('cy', s => yScale(s.bmi))
		.attr('r', 3.5)
		.style('opacity', 0.3)
		.style('fill', s => {
			count += 1;
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
		})
		.on('mouseover', function(s){
            chart.append("text")
                .attr('class', 'val')
                .attr('x', function() {
                    return xScale(s.Age) + 5
                })
                .attr('y', function() {
                    return yScale(s.bmi) - 2;
                })
                .text(function() {
                    return "Event: "+s.Event;
                })
            chart.append("text")
                .attr('class', 'val')
                .attr('x', function() {
                    return xScale(s.Age) +5
                })
                .attr('y', function() {
                    return yScale(s.bmi) - 17;
                })
                .text(function() {
                    return "Name: "+s.Name;
                })



		})
		 .on('mouseout', function (data, index) {
            chart.selectAll('.val')
                .remove()
         });

}

