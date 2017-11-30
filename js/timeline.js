var timelineWidth = 1000,
timelineHeight = 500,
timelineMargin = {top: 30, bottom: 30, right: 30, left: 30},
timelinesvg = d3.select(".timeline").append("svg")
	.attr("width", timelineWidth)
	.attr("height", timelineHeight)

var circles = timelinesvg.append('g')
    	.attr("class", "circles")

var ticks = timelinesvg.append('g')
    	.attr("class", "ticks")


var tooltip = d3.select(".timeline")
    .append("div")
    .attr("class","timeline-tool-tip")
    //.style("transform", "translate(" + margin.left+"px" + "," + margin.top+"px" + ")")
    .on("click",function(){
      chartToolTip.style("visibility",null);
    });

d3.csv('data/timeline.csv', function(data) {
	console.log(data);

	var formatYear = d3.timeFormat('%Y');
	console.log(formatYear(data[0].year))
	//var timeScale = d3.scaleLinear()

	console.log(d3.extent(data, function(d) { return d.year; }));
	var timeScale = d3.scaleTime()
    .domain([1880,2020])
    .range([timelineMargin.left, timelineWidth-timelineMargin.right]);

    circles.selectAll(".skater")
    	.data(data)
    	.enter()
    	.append("circle")
    	.attr('r', 3)
    	.attr('cx', function(d) { return timeScale(d.year); })
    	.attr('cy', 300)
    	.style('stroke', 'black')

    ticks.selectAll(".tick")
    	.data([1880,1900,1920,1940,1960,1980,2000,2020])
    	.enter()
    	.append("text")
    	/*.attr('x1',function(d) { return timeScale(d); })
    	.attr('x2', function(d) { return timeScale(d); })
    	.attr('y1', function(d) { return 110; })
    	.attr('y2', function(d) { return 120; })*/
    	.text(function(d) { return d; })
    	.attr('x', function(d) { return timeScale(d); })
    	.attr('y', 320)
    	.attr("font-family", "Roboto")
    	.attr("font-size", "12px")

    	
})