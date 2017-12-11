var wrdiv = d3.select(".wrprogression"),
wrwidth = 1300,
wrheight = 680,
wrmargin = {top: 50, left: 50, right: 50, bottom: 50},
wrsvg = wrdiv.append("svg")
	.attr("class", "wrsvg svg")
	.attr("width", wrwidth)
	.attr("height", wrheight),
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
	console.log(menswr);
	console.log(womenswr);
	console.log(mencompetitions)
	console.log(womencompetitions)



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
	var wrline = d3.line()
	 	.curve(d3.curveLinear)
		.x(function(d) { return scoreScale(d['Score']);})
		.y(function(d) { return wrtimeScale(wrtimeParse(d['Date']));})

	xticks = []
	for (var i = 2004; i < 2019; i++) {
		xticks.push('01 January ' + i.toString())
	}
	//console.log(xticks)
	yticks = []
	for (var i = 190; i <= 340; i+= 20) {
		yticks.push(i)
	}
	//console.log(yticks);

	wryaxis = wrsvg.append('g')
		.attr("class", "wr-y-axis")

	wryaxis.selectAll("g")
		.data(yticks)
		.enter()
		.append("text")
		.text(function(d) { return d;})
		.attr('x', function(d) { return scoreScale(d); })
    	.attr('y', wrmargin.bottom -10)
    	.attr("font-family", "Roboto")
    	.attr("font-size", "12px")
    	.attr("text-anchor", "end")
    	.attr("alignment-baseline", "middle")


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


   	wrlines = wrsvg.append('g')
   		.attr("class", "wrlines")
    var menspath = wrlines.append('path')
	  .datum(menswr)
	    .attr('d', wrline)
	    .attr("fill", "none")
  .attr("stroke", "black");

  /*var womenspath = wrlines.append('path')
	  .datum(womenswr)
	    .attr('d', wrline)
	    .attr("fill", "none")
  .attr("stroke", "black");*/

	    
	var menswrcircles = wrsvg.append('g')
		.attr("class", "men-wr-circles")
	menswrcircles.selectAll('g')
		.data(menswr)
		.enter()
		.append('circle')
		.attr("r", 3)
		.attr('cx',  function(d) { return scoreScale(d['Score'])})
		.attr('cy', function(d) { return wrtimeScale(wrtimeParse(d['Date']))})
		.on('mouseover', function(d) {
			data = d;
		 
		 	mouseOverEvents(data,d3.select(this));

		})
		.on('mouseout', function(d) {
			data = d;
			mouseOutEvents(data,d3.select(this));
		})
	/*var womenswrcircles = wrsvg.append('g')
		.attr("class", "women-wr-circles")
	womenswrcircles.selectAll('g')
		.data(womenswr)
		.enter()
		.append('circle')
		.attr("r", 3)
		.attr('cx', function(d) { return wrtimeScale(wrtimeParse(d['Date']))})
		.attr('cy', function(d) { return scoreScale(d['Score'])})
		.on('mouseover', function(d) {
			data = d;
		 
		 	mouseOverEvents(data,d3.select(this));

		})
		.on('mouseout', function(d) {
			data = d;
			mouseOutEvents(data,d3.select(this));
		})*/

	 var medalsgroup = wrsvg.append('g')
	 	.attr("class", "medals")

	 var medals = medalsgroup.selectAll('g')
	 	.data(mencompetitions)
	 	.enter()
	 	.append('g')

	 medals.append("circle")
	 	.attr("class","medal")
	 	.attr("cx", function(d) {  return scoreScale(d.combined)})
	 	.attr("cy", function(d) {  return wrtimeScale(wrtimeParse2(d.date)); })
	 	.attr('r', 5)

	 	.style('fill', function(d) {  return medalColor(d.rank);})
	 	.style("stroke", function(d) {  console.log(medalColor(d.rank)); return d3.color(medalColor(d.rank)).darker();})
	

	function mouseOverEvents(data, element) {
 
    	var tooltipcontainer = wrtooltip.append("div");

    	/*tooltipcontainer.append("div")
						.attr("class", "play")
						.text(function () { return "Click to play"; })*/
					

      	tooltipcontainer.append("div")
						.attr("class", "skater-name")
						.text(function () { return data['Name'] + "      "; })
						.append("img")
						.attr('src', function(d) { return "images/"+ data.Country+"flag.png"; });
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
    	   	wrtooltip.selectAll("div").remove();
    	wrtooltip
       		.style("visibility",null);
	  }
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