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
      tooltip.style("visibility",null);
    });

d3.csv('data/timeline.csv', function(data) {

	var formatYear = d3.timeFormat('%Y');

	var timeScale = d3.scaleTime()
    .domain([1880,2020])
    .range([timelineMargin.left, timelineWidth-timelineMargin.right]);

    circles.selectAll("g")
    	.data(data)
    	.enter()
    	.append("g")
    	.attr("class", "skater")
    	.append("circle")
    	.attr("class", "item")
    	.attr('r', 3)
    	.attr('cx', function(d) { return timeScale(d.year); })
    	.attr('cy', 10)
    	.on("mouseover", function(d) {
		 	data = d;
		 	d3.select(this).classed("hover", true);
		 	mouseOverEvents(data,d3.select(this));
		

		})  
		.on("click", function(d) {
			console.log("getting clicked");
			d3.selectAll(".skater .item").classed("is-playing", false);
			d3.select(this).classed("is-playing", true);
		})
		.on("mouseout", function(d) {
		 	data = d;
		 	d3.select(this).classed("hover", false);
		 	mouseOutEvents(data,d3.select(this));

		})                   

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
    	.attr('y', 30)
    	.attr("font-family", "Roboto")
    	.attr("font-size", "12px")

    function mouseOverEvents(data, element) {
    	tooltip.selectAll("div").remove();
    	var tooltipcontainer = tooltip.append("div");

    	tooltipcontainer.append("div")
						.attr("class", "play")
						.text(function () { return "Click to play"; })
					

      	tooltipcontainer.append("div")
						.attr("class", "skater-name")
						.text(function () { return data.skater + "      "; })
						.append("img")
						.attr('src', function(d) { return "images/"+ data.country+"flag.png"; });
      	tooltipcontainer.append("div")
						.attr("class", "skater-first")
						.text(function () { 
							console.log(data.first.split(" ")[0])
							if (data.first.split(" ")[0] == "single" && data.gender != "female") {
								console.log(data.first.substring(1,2));
								return "The originator of the " + data.first.split(" ").slice(1,3);
							}
							else {
								if (data.gender == "male") {
									return "The first man to perform the " + data.first;
								} else {
									return "The first woman to perform the " + data.first;
								}
							}
						})
      	tooltipcontainer.append("div")
      					.attr("class", "skater-time")
      					.text(function () { 
      						if (data.competition != "N/A") {
      							return data.year + " " + data.competition;
      						} else {
      							return data.year;
      						}
      					})

      									

      	
      	tooltip
          .style("visibility","visible")
          .style("top",function(d){
            /*if(viewportWidth < 450 || mobile){
              return "250px";
            }*/
            return (d3.event.pageY) + 25 +"px"
          })
          .style("left",function(d){
            /*if(viewportWidth < 450 || mobile){
              return "0px";
            }*/
            return (d3.event.pageX) +"px";
          })

    }
    function mouseOutEvents(data, element) {
    	tooltip
       		.style("visibility",null);
	}

    	
})