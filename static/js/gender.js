function init_gender_scatter(svg, year){
	setTimeout(() => {
		show_gender_scatter(svg, year);
	}, 50);
}

function show_gender_scatter(svg, year) {

    let width = parseInt(svg.style('width')) - 2*margin,
		height = parseInt(svg.style('height')) - 2*margin,
		x_label = "Years",
		y_label = "Count",
		title = 'Gender Distribution',
		type = 'Years';


	let url = `/gender/all/regions/${countrySelected}/seasons/${season}`;
	if(!showBars){
		x_label = "Regions"
		type = "Regions"
	    url = `/gender/${year}/regions/all/seasons/${season}`;
	}

	$.get(url, function(data) {
		if (data) {
		    data = JSON.parse(data).data;
            plot_gender_scatter(
				svg,
				data,
				width,
				height,
				type,
				x_label
			)
	    }
	});

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
		.attr('y', 2*margin + height) // - the overflow
		.attr('text-anchor', 'middle')
		.attr('class', 'labels')
		.attr('class', 'x_label_class')
		.text(x_label);
}

function plot_gender_scatter(svg, data, width, height,type,x_label) {

	let chart, x, y;
	const xScale = d3.scaleBand(),
		yScale = d3.scaleLinear();
    let domainX = [];
    data.forEach(function(d){
        domainX.push(type=="Years"?d.Year:d.Region)
    })
	let domainY = [0, d3.max(data.map(d => d.Count)) * 1.10];
	yScale.range([height, 0]).domain(domainY);
	xScale.range([0, width]).domain(domainX);

	if (svg.select('g#chart').empty()) {
		chart = svg.append('g')
			.attr('id', 'chart')
			.attr('transform', `translate(${margin},${0.75*margin})`);
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

        d3.selectAll(".scatter_circle").remove()
        d3.selectAll(".menLine").remove()
        d3.selectAll(".femaleLine").remove()
        d3.selectAll(".x_label_class").remove()

        svg.append('text')
		.attr('x', width / 2 + margin)
		.attr('y', 2*margin + height) // - the overflow
		.attr('text-anchor', 'middle')
		.attr('class', 'labels')
		.attr('class', 'x_label_class')
		.text(x_label);

		x = chart.selectAll('.xaxis');
		y = chart.selectAll('.yaxis');
	}

	y.transition(globalTransition).call(d3.axisLeft(yScale))
	x.transition(globalTransition).call(d3.axisBottom(xScale));

    let rotateAngle = -45,translate = 10,translateX = 0;
    if(domainX.length>20){
        rotateAngle = -90;
        translate = 35
        translateX = -(xScale.bandwidth()/2)
    }
    x.selectAll('text')
    .attr('transform', `translate(${translateX},${translate}) rotate(${rotateAngle})`);

    let menDataPoint = [];
    let femaleDataPoints =[];

	let count = 0;

	let circles = chart.selectAll()
		.data(data)
		.enter()
		.append('circle')
		.attr('class', 'scatter_circle')
		.attr('cx', s => xScale(type=="Years"?s.Year:s.Region) + (xScale.bandwidth()/2))
		.attr('cy', s => yScale(s.Count))
		.attr('r', 3.5)
		.style('fill', s => {
			count++;
			if(s.Sex =="M"){
			    menDataPoint.push(s);
			    return 'blue';
		    }
		    femaleDataPoints.push(s);
		    return 'pink';
		});

    let line = d3.line()
    .x(function(s) {
        return xScale(type=="Years"?s.Year:s.Region) + (xScale.bandwidth()/2)
        })
    .y(function(s) {
        return yScale(s.Count)
        });

    if(type=="Years"){
    chart.append("path")
     .data([menDataPoint])
     .attr("class", "menLine")
     .attr("d", line)


     chart.append("path")
     .data([femaleDataPoints])
     .attr("class", "femaleLine")
     .attr("d", line)

    }
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
