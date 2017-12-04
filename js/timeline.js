var timelineWidth = 600,
timelineHeight = 140,
timelineMargin = {top: 30, bottom: 30, right: 30, left: 60},
timelinesvg = d3.select(".timeline").append("svg")
	.attr("width", timelineWidth)
	.attr("height", timelineHeight)

var jumpmap = {"single" : 1, "double" : 2, "triple" : 3, "quadruple" : 4};
var yaxislines = timelinesvg.append('g')
		.attr("class", "y-axis")

var circles = timelinesvg.append('g')
    	.attr("class", "circles")

var ticks = timelinesvg.append('g')
    	.attr("class", "ticks")

var yticks = timelinesvg.append('g')
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

    var yScale = d3.scaleLinear()
    	.domain([1,4])
    	.range([timelineHeight-timelineMargin.top, timelineMargin.bottom])
   

    yaxislines.selectAll("g")
    			.data(["single", "double", "triple", "quadruple"])
    			.enter()
    			.append("line")
    			.attr("class", "y-axis-lines")
    			.attr("transform", function(d,i) { return "translate(0," + yScale(jumpmap[d]) + ")";})
    			.attr('x1', timelineMargin.left)
    			.attr('y1', 0)
    			.attr('x2', timelineWidth)
    			.attr('y2', 0);

    circles.selectAll("g")
    	.data(data)
    	.enter()
    	.append("g")
    	.attr("class", "skater")
    	.append("circle")
    	.attr("class", "item")
    	.attr('r', 3)
    	.attr('cx', function(d) { 
    		if (d.skater == "Shoma Uno") {
    		
    			return timeScale("2017");
    		} else if (d.skater == "Vern Taylor") {
    			return timeScale("1979");
    		} else if (d.first == "double loop") {
    			return timeScale("1924");
    		} else if (d.skater == "Donald Jackson") {
    			return timeScale("1963");
    		}
    			else {
    			return timeScale(d.year); }
    		})
    		
    	.attr('cy', function(d) { return yScale(jumpmap[d.first.split(" ")[0]]);})
    	.on("mouseover", function(d) {
		 	data = d;
		 	d3.select(this).classed("hover", true);
		 	mouseOverEvents(data,d3.select(this));
		

		})  
		.on("click", function(d) {
			//mouseOutEvents(data,d3.select(this));
			data = d;
			d3.selectAll(".skater .item").classed("is-playing", false);
			d3.select(this).classed("is-playing", true);
			d3.select(".video #player")
				.attr("src", function (d) {
					if (data.url != "") {
						return data.url;
					}
				})
			d3.select(".name-label").text(function () { return data.skater + "      "; })
						.append("img")
						.attr('src', function(d) { return "images/"+ data.country+"flag.png"; });
			d3.select(".desc-label").text(function () { 
							if (data.first.split(" ")[0] == "single" && data.gender != "female") {
								return "The originator of the " + data.first.split(" ").slice(1,3).join(" ");
							}
							else {
								if (data.gender == "male") {
									return "The first man to perform the " + data.first;
								} else {
									return "The first woman to perform the " + data.first;
								}
							}
						})
			d3.select(".year-label").text(function () { 
      						if (data.competition != "N/A") {
      							return data.year + " " + data.competition;
      						} else {
      							return data.year;
      						}
      					})
			//mouseOverEvents(data,d3.select(this));
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
    	.attr('y', timelineHeight - timelineMargin.top + 20)
    	.attr("font-family", "Roboto")
    	.attr("font-size", "12px")


    yticks
    	.selectAll(".tick")
    	.data(["single", "double", "triple", "quadruple"])
    	.enter()
    	.append("text")
    	.text(function(d) { return d;})
    	.attr('x', timelineMargin.left-5)
    	.attr('y', function(d) { return yScale(jumpmap[d]); })
    	.attr("font-family", "Roboto")
    	.attr("font-size", "12px")
    	.attr("alignment-baseline", "middle")
    	.attr("text-anchor", "end");
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
							if (data.first.split(" ")[0] == "single" && data.gender != "female") {
								
								return "The originator of the " + data.first.split(" ").slice(1,3).join(" ");
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
            return (d3.event.pageY)+ 15+"px"
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