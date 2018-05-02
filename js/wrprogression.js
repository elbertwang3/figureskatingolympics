var wrdiv = d3.select(".wrprogression"),
wrwidth = 1300,
wrheight = 680,
wrmargin = {top: 50, left: 50, right: 50, bottom: 50},
toggles = wrdiv.append("div")
    .attr("class","histogram-chart-toggle-wrapper"),
prevcut = "",
cut = "Men",
wrsvg = wrdiv.append("svg")
 .attr("viewBox", "0 0 " + (wrwidth) + " " + (wrheight))
	.attr("class", "wrsvg svg")
	.attr("width", wrwidth)
	.attr("height", wrheight);
wrtooltip = d3.select(".wrprogression")
    .append("div")
    .attr("class","timeline-tool-tip")
    //.style("transform", "translate(" + margin.left+"px" + "," + margin.top+"px" + ")")
    .on("click",function(){
      wrtooltip.style("visibility",null);
    });

d3.queue()
    .defer(d3.csv, "data/menswr.csv", cast)
    .defer(d3.csv, "data/womenswr.csv", cast)
    .defer(d3.csv, "data/mencompetitions2.csv", cast2)
    .defer(d3.csv, "data/womencompetitions2.csv", cast2)
    .await(ready);

function ready(error,menswr, womenswr, mencompetitions, womencompetitions) {


	toggles
    .append("div")
    .attr("class","histogram-chart-toggle-type")
    .selectAll("p")
    .data(["Men","Women"])
    .enter()
    .append("p")
    .attr("class","histogram-chart-toggle-item")
    .text(function(d){
      return d;
    })
     .attr("class",function(d,i){
        if(i==0){
          return "toggle-selected front-curve histogram-chart-toggle-item";
        }
        if(i==1){
          return "back-curve histogram-chart-toggle-item";
        }
        return "histogram-chart-toggle-item";
      })
      .text(function(d){
        return d;
      })
      .on("click",function(d){

        //previousChart = currentChart;
        var dataSelected = d;
        d3.select(this.parentNode).selectAll("p").classed("toggle-selected",function(d){
          if(d==dataSelected){
            return true;
          }
          return false;
        })
        prevcut = cut;
        cut = d;
        if (prevcut != cut) {
        	updateChart();
        }
      
      });




	scoreScale = d3.scaleLinear()
					.domain([180,340])
					.range([wrmargin.left, wrwidth - wrmargin.right])
		
	wrtimeParse = d3.timeParse("%d %B %Y")
	wrtimeParse2 = d3.timeParse("%m/%d/%y")
	wrtimeScale = d3.scaleLinear()
					.domain([wrtimeParse("01 October 2003"),wrtimeParse("09 February 2018")])
					.range([wrheight - wrmargin.bottom, wrmargin.top])

	medalColor = d3.scaleOrdinal()
					.domain([1,2,3])
					.range(['#FFD700', "#C0C0C0", "#CD7F32"])
	

	xticks = []
	for (var i = 2004; i < 2019; i++) {
		xticks.push('01 January ' + i.toString())
	}
	//console.log(xticks)
	yticksmen = []
	for (var i = 190; i <= 340; i+= 20) {
		yticksmen.push(i)
	}
	ytickswomen = []
	for (var i = 160; i <= 240; i+= 20) {
		ytickswomen.push(i)
	}

	//console.log(yticks);

	wryaxis = wrsvg.append('g')
		.attr("class", "wr-y-axis")

	wryaxis.selectAll("g")
		.data(yticksmen)
		.enter()
		.append("text")
		.text(function(d) { return d;})
		.attr('x', function(d) { return scoreScale(d); })
    	.attr('y', wrmargin.bottom -10)

    	.attr("text-anchor", "middle")



	wrhorizontallines = wrsvg.append('g')
		.attr("class", "horizontal-lines")

	wrhorizontallines.selectAll("g")
		.data(xticks)
		.enter()
		.append("line")
		.attr("class", 'y-axis-lines')
		.attr("transform", function(d,i) { return "translate(0," + wrtimeScale(wrtimeParse(d)) + ")";})
		.attr('x1', wrmargin.left)
		.attr('y1', 0)
		.attr('x2', wrwidth - wrmargin.right)
		.attr('y2', 0);

	wrxaxis = wrsvg.append('g')
		.attr("class", "wr-x-axis")

	wrxaxis.selectAll("g")
		.data(xticks)
		.enter()
		.append("text")
		.text(function(d) { return  d.split(" ")[2];})
		.attr('x', wrmargin.left-15)
    	.attr('y', function(d) { return wrtimeScale(wrtimeParse(d)); })
    	.attr("font-family", "Roboto")
    	.attr("font-size", "12px")
    	.attr("text-anchor", "end")
    	.attr("alignment-baseline", "middle")

    var wrline = d3.line()
	 	.curve(d3.curveLinear)
		.x(function(d) { return scoreScale(d['Score']);})
		.y(function(d) { return wrtimeScale(wrtimeParse(d['Date']));})
   	var wrlines = wrsvg.append('g')
   		.attr("class", "wrlines")
   	wrlines.append('g')
   		.datum(menswr[0])
   		.append('text')
   		.attr("class","wr-annotation")
   		.attr('text-anchor', 'middle')
		.attr('x',  function(d) { return scoreScale(d['Score'])})
		.attr('y', function(d) { return wrtimeScale(wrtimeParse(d['Date'])) - 15})
   		.text("World record progression line")
   		

   /*wrlines.selectAll('g')
		.data(menswr[0])
		.enter()
		.append('g')
		.append('text')
		
   		.text("World record progression line")
   		.attr('cx',  function(d) { return scoreScale(d['Score'])})
		.attr('cy', function(d) { return wrtimeScale(wrtimeParse(d['Date']))})*/
    var wrpath = wrlines.append('path')
	  .datum(menswr)
	    .attr('d', wrline)
	    .attr("fill", "none")
  .attr("stroke", "black");

  /*var womenspath = wrlines.append('path')
	  .datum(womenswr)
	    .attr('d', wrline)
	    .attr("fill", "none")
  .attr("stroke", "black");*/

	    
	var wrcircles = wrsvg.append('g')
		.attr("class", "wr-circles")
	wrcircles.selectAll('g')
		.data(menswr)
		.enter()
		.append('circle')
		.attr("r", 3)
		.attr('cx',  function(d) { return scoreScale(d['Score'])})
		.attr('cy', function(d) { return wrtimeScale(wrtimeParse(d['Date']))})
		.on('mouseover', function(d) {
			data = d;
		 	d3.select(this).classed("hover", true);
		 	mouseOverEventsWR(data,d3.select(this));

		})
		.on('mouseout', function(d) {
			data = d;
			d3.select(this).classed("hover", false);
			mouseOutEvents(data,d3.select(this));
		})

	

	 var medalsgroup = wrsvg.append('g')
	 	.attr("class", "medals")

	 var medals = medalsgroup.selectAll('g')
	 	.data(mencompetitions)
	 	.enter()
	 	.append('g')

	 medals.append("circle")
	 	.attr("class","medal")
	 	.attr("data-name", function(d) { return d.name;})
	 	.attr("cx", function(d) {  return scoreScale(d.combined)})
	 	.attr("cy", function(d) {  return wrtimeScale(wrtimeParse2(d.date)); })
	 	.attr('r', 5)

	 	.style('fill', function(d) {  return medalColor(d.rank);})
	 	.style("stroke", function(d) { return d3.color(medalColor(d.rank)).darker();})
	 	.on("mouseover", function(d) {
	 
	 		data = d
	 		d3.selectAll("[data-name='" + d.name+"']")
	 			.classed("hover", true)
	 			.style("stroke", "black");
	 		mouseOverEvents(data, d3.select(this))

	 	})
	 	.on("mouseout", function(d) {

	 		data = d;
	 		d3.selectAll("[data-name='" + d.name+"']")
	 		.classed("hover", false)
	 			.style("stroke", function(d) { return d3.color(medalColor(d.rank)).darker();});
	 		mouseOutEvents(data, d3.select(this))

	 	})
	function updateChart() {
		if (cut == "Women") {
			scoreScale = d3.scaleLinear()
					.domain([150,250])
					.range([wrmargin.left, wrwidth - wrmargin.right])
		} else {
			scoreScale = d3.scaleLinear()
					.domain([180,340])
					.range([wrmargin.left, wrwidth - wrmargin.right])
		}
		
		console.log(cut);
		 wryaxis
          .selectAll("text")
          .transition()
          .duration(500)
          .style("opacity",0)
          .on("end",function(d){
            d3.select(this).remove();
          });

		wryaxis.selectAll("g")
			.data(function() { 
				if (cut == "Men") {
					return yticksmen;
				} else {
					return ytickswomen;
				}
			})
			.enter()
			.append("text")
			.text(function(d) { return d;})
			  
			.attr('x', function(d) { return scoreScale(d); })
	    	.attr('y', wrmargin.bottom -10)
	    	.attr('text-anchor', 'middle')
	    	.style("opacity", 0)
		   	.transition()
		    .delay(500)
		   	.duration(500)
 			.style("opacity", 1)

 		if (cut == "Men") {
 			 medals = medalsgroup.selectAll("g")
 			 .data(mencompetitions)
	 	

			 medals.select('circle')

			 	.attr("data-name", function(d) { console.log(d);return d.name;})
			 	.on("mouseover", function(d) {
			 		console.log(d);
			 		data = d
			 		d3.selectAll("[data-name='" + d.name+"']")
			 			.classed("hover", true)
			 			.style("stroke", "black");
			 		mouseOverEvents(data, d3.select(this))

			 	})
			 	.on("mouseout", function(d) {
			 		console.log(d);
			 		data = d;
			 		d3.selectAll("[data-name='" + d.name+"']")
			 		.classed("hover", false)
			 			.style("stroke", function(d) { return d3.color(medalColor(d.rank)).darker();});
			 		mouseOutEvents(data, d3.select(this))

			 	})
			 	.transition()
			 	.duration(1000)
			 	.attr("cx", function(d) {  return scoreScale(d.combined)})
			 	.attr("cy", function(d) {  return wrtimeScale(wrtimeParse2(d.date)); })
			 	.attr('r', 5)

			 	.style('fill', function(d) {  return medalColor(d.rank);})
			 	.style("stroke", function(d) { return d3.color(medalColor(d.rank)).darker();})

			 	wrpath = wrlines.select("path")
				  	.datum(menswr)
				  	.transition()
					.duration(1000)
				    .attr('d', wrline)
				    .attr("fill", "none")
			  		.attr("stroke", "black");

			  	wrlines.select('g')
		   		.datum(menswr[0])
		   		.select('text')
		   		.attr("class","wr-annotation")
		   		.transition()
				.duration(1000)
				.attr('x',  function(d) { return scoreScale(d['Score'])})
				.attr('y', function(d) { return wrtimeScale(wrtimeParse(d['Date'])) - 15})
		   		.text("World record progression line")



			 	wrcircle = wrcircles.selectAll("circle")
					.data(menswr)
				wrcircle.exit().remove()
				wrcircle
					.on('mouseover', function(d) {
						data = d;
					 	d3.select(this).classed("hover", true);
					 	mouseOverEventsWR(data,d3.select(this));

					})
					.on('mouseout', function(d) {
						data = d;
						d3.select(this).classed("hover", false);
						mouseOutEvents(data,d3.select(this));
					})
					.attr("r", 3)
					.transition()
					.duration(1000)
					.attr('cx',  function(d) { return scoreScale(d['Score'])})
					.attr('cy', function(d) { return wrtimeScale(wrtimeParse(d['Date']))})
					

			 	

 		} else {
 			console.log("getting here to women");
 			 medals = medalsgroup.selectAll("g")
 			 .data(womencompetitions)
	 	

			 medals.select('circle')

			 	.attr("data-name", function(d) { return d.name;})
			 	.on("mouseover", function(d) {
			 		data = d
			 		d3.selectAll("[data-name='" + d.name+"']")
			 			.classed("hover", true)
			 			.style("stroke", "black");
			 		mouseOverEvents(data, d3.select(this))

			 	})
			 	.on("mouseout", function(d) {

			 		data = d;
			 		d3.selectAll("[data-name='" + d.name+"']")
			 		.classed("hover", false)
			 			.style("stroke", function(d) { return d3.color(medalColor(d.rank)).darker();});
			 		mouseOutEvents(data, d3.select(this))

			 	})
			 	.transition()
			 	.duration(1000)
			 	.attr("cx", function(d) {  return scoreScale(d.combined)})
			 	.attr("cy", function(d) {  return wrtimeScale(wrtimeParse2(d.date)); })
			 	.attr('r', 5)
			 	.style('fill', function(d) {  return medalColor(d.rank);})
			 	.style("stroke", function(d) { return d3.color(medalColor(d.rank)).darker();})
			 	
		
			wrpath = wrlines.select("path")
			  	.datum(womenswr)
			  	.transition()
				.duration(1000)
			    .attr('d', wrline)
			    .attr("fill", "none")
		  		.attr("stroke", "black");
		  	wrlines.select('g')
		   		.datum(womenswr[0])
		   		.select('text')
		   		.attr("class","wr-annotation")
		   		.attr('text-anchor', 'middle')
		   		.transition()
				.duration(1000)
				.attr('x',  function(d) { return scoreScale(d['Score'])})
				.attr('y', function(d) { return wrtimeScale(wrtimeParse(d['Date'])) - 15})
		   		.text("World record progression line")


	   
			
			var wrcircle = wrcircles.selectAll("circle")
				.data(womenswr)
				
			wrcircle.enter()
				.append("circle")
				.merge(wrcircle)
				.on('mouseover', function(d) {
					console.log(d);
					data = d;
				 	d3.select(this).classed("hover", true);
				 	mouseOverEventsWR(data,d3.select(this));

				})
				.on('mouseout', function(d) {
					data = d;
					d3.select(this).classed("hover", false);
					mouseOutEvents(data,d3.select(this));
				})
				.attr("r", 3)
				.transition()
				.duration(1000)
				.attr('cx',  function(d) { console.log(d); return scoreScale(d['Score'])})
				.attr('cy', function(d) { return wrtimeScale(wrtimeParse(d['Date']))})
				


 		}
	    

	}

	function mouseOverEvents(data, element) {
 
    	var tooltipcontainer = wrtooltip.append("div");

    	/*tooltipcontainer.append("div")
						.attr("class", "play")
						.text(function () { return "Click to play"; })*/
					

      	nameline = tooltipcontainer.append("div")
						.attr("class", "skater-name")
						.text(function () { return data['name'] + "      "; })
		nameline.append("img")
						.attr('src', function(d) { return "images/"+ data.country+"flag.png"; })
		nameline.append("img")
						.attr('src', function(d) { return "images/"+ data.rank+".png"; });
      	tooltipcontainer.append("div")
						.attr("class", "skater-first")
						.text(function () { 
							return 'Combined score: ' + data['combined'];
						})
      	tooltipcontainer.append("div")
      					.attr("class", "skater-time")
      					.text(function () { 
      					
      						return data['competition']
      						
      					})

     						

      	
      	wrtooltip
          .style("visibility","visible")
          .style("top",function(d){
            /*if(viewportWidth < 450 || mobile){
              return "250px";
            }*/
            return (d3.event.pageY+15)+"px"
          })
          .style("left",function(d){
            /*if(viewportWidth < 450 || mobile){
              return "0px";
            }*/
            return (d3.event.pageX-200) +"px";
          })

    }
    function mouseOutEvents(data, element) {
    	wrtooltip.selectAll("div").remove();
    	wrtooltip
       		.style("visibility",null);
	  }
	}
	function mouseOverEventsWR(data, element) {
 
    	var tooltipcontainer = wrtooltip.append("div");

    	/*tooltipcontainer.append("div")
						.attr("class", "play")
						.text(function () { return "Click to play"; })*/
					

      	nameline = tooltipcontainer.append("div")
						.attr("class", "skater-name")
						.text(function () { return data['Name'] + "      "; })
		nameline.append("img")
						.attr('src', function(d) { return "images/"+ data.Country+"flag.png"; })
		
      	tooltipcontainer.append("div")
						.attr("class", "skater-first")
						.text(function () { 
							return 'Record-setting score: ' + data['Score'];
						})
      	tooltipcontainer.append("div")
      					.attr("class", "skater-time")
      					.text(function () { 
      					
      						return data['Event']
      						
      					})

     						

      	
      	wrtooltip
          .style("visibility","visible")
          .style("top",function(d){
            /*if(viewportWidth < 450 || mobile){
              return "250px";
            }*/
            return (d3.event.pageY+15)+"px"
          })
          .style("left",function(d){
            /*if(viewportWidth < 450 || mobile){
              return "0px";
            }*/
            return (d3.event.pageX-200) +"px";
          })

    }

function cast(d) {
  return {
  	'Date': d['Date'],
  	Name: d['Name'],
  	Country: d['Country'],
   	Score: +d['Score'],
   	Event: d['Event']
  };
}

function cast2(d) {
  return {
  	date: d['date'],
  	name: d['name'],
  	country: d['country'],
   	combined: +d['combined'],
   	sp: +d['sp'],
   	fs: +d['fs'],
   	competition: d['competition'],
   	rank: +d['rank']
  };
}

var wrchart = $(".wrsvg"),
    wraspect = wrchart.width() / wrchart.height(),
       wrcontainer = wrchart.parent();
$(window).on("resize", function() {

	 var targetWidth = wrcontainer.width();
	 if (targetWidth > 1300) {
      targetWidth = 1300;
   }
 
    wrchart.attr("width", targetWidth);
    wrchart.attr("height", Math.round(targetWidth / wraspect));
}).trigger("resize");