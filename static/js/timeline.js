var yearSelected = 1896;

function createTimeline(redrawMaps) {

	$.get(`/timeline/${season}`, function(data) {
		let tickValues = [],
			updateMapsTimer;

		JSON.parse(data).data.forEach(dict => tickValues.push(dict["0"]));
		tickValues.sort();

		yearSelected = tickValues[0];

		let timelineSVG = d3.select(".timeline-svg");
		timelineSVG.selectAll("*").remove();


		let timelineWidth = parseInt(timelineSVG.style("width")),
			timelineHeight = parseInt(timelineSVG.style("height"));

		let width = +timelineWidth - 2*margin,
			height = +timelineHeight;

		let x = d3.scaleBand()
			.domain(tickValues)
			.range([0, width]);
		let leftLimit = x(tickValues[0]);
		let rightLimit = x(tickValues[tickValues.length - 1]);

		let slider = timelineSVG.append("g")
			.attr("class", "slider")
			.attr("transform", "translate(" + margin + "," + height / 2 + ")")
			.attr('width', width);

		slider.append("line")
			.attr("class", "track")
			.attr("x1", x.range()[0])
			.attr("x2", x.range()[1])
			.select(function() {
				return this.parentNode.appendChild(this.cloneNode(true));
			})
			.attr("class", "track-inset")
			.select(function() {
				return this.parentNode.appendChild(this.cloneNode(true));
			})
			.attr("class", "track-overlay")
			.call(d3.drag()
				.on("start.interrupt", function() { slider.interrupt(); })
				.on("start drag", function() {
					clearTimeout(updateMapsTimer);
					console.log("Event Triggered");
					let year;
					if (d3.event.x < leftLimit || d3.event.x > rightLimit) {
						let xidx = d3.event.x < leftLimit ? 0 : tickValues.length - 1;
						handle.attr("x", x(tickValues[xidx]));
						year = tickValues[xidx];
					} else {
						handle.attr("x", x(tickValues[Math.floor((d3.event.x/x.step()))]));
						year = tickValues[Math.floor(d3.event.x/x.step())];
					}

					if ( year != yearSelected ) {
						updateMapsTimer = setTimeout(() => {
							console.log('Timeout triggered');
							updateMaps(year);
						}, 50);
					}
					//        hue(x.invert(d3.event.x));
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

		var handle = slider.insert("svg:image",".track-overlay")
			.attr("class", "handle")
			.attr('x', -2)
			.attr('y', -20)
			.attr('width', 20)
			.attr('height', 24)
			.attr("xlink:href", "static/athlete.svg")

		slider.transition(globalTransition)
			.tween("hue", function() {
				var i = d3.interpolate(0, 70);
				return function(t) { hue(i(t)); };
			});

		function hue(h) {
			handle.attr("x", x(h));
		}
		if (redrawMaps === true)
			updateMaps(yearSelected);

	});
}
