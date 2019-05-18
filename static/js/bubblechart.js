var generate_callback_with_year;
function init_participation_bubble(svg, year, on_click_callbk) {
	setTimeout(() => {
		show_participation_bubble(svg, year, on_click_callbk);
	}, 0);
}

function show_participation_bubble(svg, year, on_click_callbk) {
	let url; 

	function year_as_clojure(year) {
		generate_callback_with_year = function () {
			let clojure_year = year;
			return function(svg, on_click_callbk) {
				init_participation_bubble(svg, clojure_year, on_click_callbk);
			};
		}
	}

	svg.selectAll("*").remove()
	$("#season-slider").show();
	if (parseInt(year)) {
		url = `/participation/all/${year}/${season}`;
		year_as_clojure(year);
	} else {
		url = '/participation/all/1896/${season}';
		year_as_clojure(1896);
	}
	
	$.get(url, function(data, reqStatus) {
			let dataset = {};
			data = JSON.parse(data);
			dataset.data = data.data;
			plot_bubble_chart(svg, dataset, on_click_callbk);

	});
	
}

var plot_bubble_chart = function(svg, dataset, on_click_callbk) {
	let height =  parseInt(svg.style("height")),
		width =  parseInt(svg.style("width")),
		color = d3.scaleOrdinal(d3.schemeCategory20),
		bubble = d3.pack(dataset)
					.size([width, height])
					.padding(1),
		nodes = d3.hierarchy(dataset, d => d.data)
					.sum(d => d.Count);

	let node = svg.selectAll(".node")
		.data(bubble(nodes).descendants())
		.enter()
		.filter((d) => {
			return !d.children;
		})
		.append("g")
		.attr("class", "node")
		.attr("transform", function(d) {
			return "translate(" + d.x + "," + d.y + ")";
		});

	node.append("title")
		.text(function(d) {
			return d.NOC + ": " + d.Count;
		});

	let circle = node.append("circle")
		.attr('class', 'country')
		.attr("r", function(d) {
			return d.r;
		})
		.attr("data-country", d => d.data.NOC)
		.style("fill", function(d,i) {
			return color(i);
		});

	node.append("text")
		.attr("dy", ".2em")
		.style("text-anchor", "middle")
		.text(function(d) {
			return d.data.NOC;
		})
		.attr("font-family", "sans-serif")
		.attr("font-size", function(d){
			return d.r/5;
		})
		.attr("fill", "white");

	node.append("text")
		.attr("dy", "1.3em")
		.style("text-anchor", "middle")
		.text(function(d) {
			return d.data.Count;
		})
		.attr("font-family",  "Gill Sans", "Gill Sans MT")
		.attr("font-size", function(d){
			return d.r/5;
		})
		.attr("fill", "white");

	if (on_click_callbk) {
		circle.datum({
			'svg': svg,
			'slider': $("#season-slider"),
			'callbk': on_click_callbk,
			'on_click_callbk': generate_callback_with_year()
		}).on('click', function(d) {
			d3.event.stopPropagation();
			d.slider.hide();
			let country = $(this).data('country');
			d.callbk(d.svg, country, 'participation', null, d.on_click_callbk);
		});
	}

}

