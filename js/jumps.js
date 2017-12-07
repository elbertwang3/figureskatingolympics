var jumpsWomenWidth = 450,
jumpsMenWidth = 470,
jumpsWomenHeight = 300,
jumpsMenHeight = 350,
jumpsMargin = {top: 30, bottom: 30, right: 30, left: 60},
mendiv = d3.select(".jumpsmen"),
womendiv = d3.select(".jumpswomen"),
headerdiv = d3.select(".jumps-header"),
mensjumparray = ['Quad Lutz', 'Quad Flip', 'Quad Loop', 'Quad Sal', 'Quad Toe', 'Triple Axel', 'Triple Lutz', 'Triple Flip','Triple Loop', 'Triple Sal', 'Triple Toe', 'Double Axel', 'Double Loop', 'Double Toe', 'Single Loop'],
mensbvarray = [13.6,12.3,12,10.5,10.3,8.5,6,5.3,5.1,4.4,4.3,3.3,1.8,1.3,0.5],
womensjumparray = ['Triple Axel', 'Triple Lutz', 'Triple Flip','Triple Loop', 'Triple Sal', 'Triple Toe', 'Double Axel', 'Double Loop', 'Double Toe', 'Single Loop'],
womensbvarray = [8.5,6,5.3,5.1,4.4,4.3,3.3,1.8,1.3,0.5],
revobj = {1 : 'Single', 2 : 'Double', 3 : "Triple", 4 : 'Quad'}
jumpobj = {'A' : "Axel", "Lz":"Lutz", "F":"Flip", "S":"Sal",'Lo':"Loop", "T":"Toe"}


var jumpstooltip = d3.select(".timeline")
    .append("div")
    .attr("class","jumps-tool-tip")
    //.style("transform", "translate(" + margin.left+"px" + "," + margin.top+"px" + ")")
    .text("4Lz")
    .on("click",function(){
      jumpstooltip.style("visibility",null);
    });
d3.queue()
    .defer(d3.csv, "data/mens.csv")
    .defer(d3.csv, "data/womens.csv")
    .await(ready);
  
  

function ready(error,mens, womens) {
	console.log(mens);
	console.log(womens);

	var mensYScale = d3.scaleLinear()
		.domain([0,mensjumparray.length-1]) //gonna need to use indexof on jumparray to get this value
		.range([jumpsMargin.top, jumpsMenHeight-jumpsMargin.bottom])

	var womensYScale = d3.scaleLinear()
		.domain([0,womensjumparray.length-1]) //gonna need to use indexof on jumparray to get this value
		.range([jumpsMargin.top, jumpsMenHeight-jumpsMargin.bottom])

	var mensXScale = d3.scaleLinear()
		.domain([0,10])
		.range([jumpsMargin.left+45, jumpsMenWidth-jumpsMargin.right+15])

	var womensXScale = d3.scaleLinear()
		.domain([0,9])
		.range([jumpsMargin.left+45, jumpsMenWidth-jumpsMargin.right+15])

	var goescale = d3.scaleLinear().domain([-3,0,3]).range(["#ff3333","#dddddd","#2161fa"]);
	var bvscale = d3.scaleLinear().domain([0,13.6]).range([2,13.6])
	//var womensbvscale = d3.scaleLinear().domain([0,8.5]).range([2,])

	var legendsvg = headerdiv.append("svg")
					.attr("class", "legend-svg")
					.attr("width", 1200)
					.attr("height", 200)



	legendsvg.append("g")
	  .attr("class", "legendSize")
	  .attr("transform", "translate(20, 40)");

	var legendSize = d3.legendSize()
	  .scale(bvscale)
	  .shape('circle')
	  .shapePadding(30)
	  .labelOffset(20)
	  .orient('horizontal')
	  .title("Circle size corresponds with the base value of the element.")
	  .titleWidth(193);


	legendsvg.select(".legendSize")
	  .call(legendSize);

	legendsvg.append("g")
	  .attr("class", "legendLinear")
	  .attr("transform", "translate(300,40)");

	var legendLinear = d3.legendColor()
		.shape("circle")
	   .shapePadding(25)
		  .labelOffset(15)
	  .orient('horizontal')
	  .cells(7)
	  .scale(goescale)
	   .title("Color corresponds with the average grade of execution (GOE) of the element this season")
		  .titleWidth(290);



	legendsvg.select(".legendLinear")
	  .call(legendLinear);



	legendsvg.select(".legendLinear .legendCells")
	  	.attr("transform", "translate(10,43)")
	legendsvg.select(".legendSize .legendTitle")
	  	.attr("transform", "translate(96.5,0)")
	  		 legendsvg.select(".legendLinear .legendTitle")
	  	.attr("transform", "translate(145,0)")

	 secondhalflegend = legendsvg.append("g")
		 	.attr("class", "secondhalflegend")
		 	 .attr("transform", "translate(320,40)")
		 	 .attr("width",300)

	d3.selectAll(".legend-svg text")
		.attr("text-anchor", "middle")

	 /*secondhalflegend.append("text")
	 	.text("elements with a circular border are performed in the second half of a program. Elements performed in the second have receive a 10% bonus.")
	 	.attr("class", "second-half-title")*/

	secondhalflegend.append("circle")
	for (var i = 0; i < mens.length; i++) {
		skatername = mens[i].skater;
		skatercountry = mens[i].country;
		

		var currentdiv = mendiv
			.append('div')
			.attr('class', 'skater-div')
		var numquads = 0
		for (var key in mens[i]) {
		    if (mens[i].hasOwnProperty(key)) {
		    	if (mens[i][key].charAt(0) == "4") {
		    		numquads += 1
		    	}
		       	
		    }
		}
		header = currentdiv.append("div")
			.attr("class","header")
			
		quadsdiv = header.append("div")
			.attr("class","quadsdiv")
		
		
		quadsdiv.append('div')
				.text(numquads)
				.attr("class", "numquads")
		quadjumps = quadsdiv.append('div')
			.attr("class", "quadjumps")
		
		quadjumps.append('span')
				.text("quad")
				.attr("class", "quad text")
		quadjumps.append('span')
				.text(function() {
					if (numquads == 1) {
						return "jump";
					} else {
						return "jumps";
					}
				})
				.attr("class", "jumps text")
				
				

		namecountrydesc = header.append("div")
			.attr("class", "namecountrydesc")
		namecountry = namecountrydesc.append("div")
			.text(skatername)
			.attr("class","namecountry")
		namecountry.append("img")
			.attr('src', "images/"+ skatercountry+"flag.png")
		namecountrydesc.append("div")
			.text(mens[i].desc)
			.attr("class","desc")

		skaterimages = currentdiv.append("div")
			.attr("class", "skater-images")
		svgdiv = currentdiv.append('div')
			.attr("class", 'svg-div')
		currentsvg = svgdiv.append('svg')
			.attr('class', 'skater-svg')
			.attr('width', jumpsMenWidth)
			.attr('height', jumpsMenHeight)

		yaxis = currentsvg.append("g")
			.attr("class", "y-axis")
		
		horizontallines = currentsvg.append("g")
			.attr("class", "horizontal-lines")

		revolutions = yaxis.append("g")
			.attr("class", "revolutions")

		jumptype = yaxis.append("g")
			.attr("class", "jumptype")
		jumpsequences = currentsvg.append("g")
			.attr("class", "jump-sequences")

		currentrev = ""

		revolutions.selectAll('.revolution')
			.data(mensjumparray)
			.enter()
			.append("text")
			.text(function(d) {
				if (d.split(" ")[0] != currentrev) {
					currentrev = d.split(" ")[0];
					return d.split(" ")[0];

				} else {
					return "";
				}
			})
			.attr('x', jumpsMargin.left-5)
	    	.attr('y', function(d) { return mensYScale(mensjumparray.indexOf(d));})
	    	.attr("font-family", "Roboto")
	    	.attr("font-size", "12px")
	    	.attr("text-anchor", "end")
	    	.attr("font-weight", 900)
	    	.attr("alignment-baseline", "middle")
		jumptype.selectAll('.jumptype')
			.data(mensjumparray)
			.enter()
			.append("text")
			.text(function(d) {
				return d.split(" ")[1];
			})
			.attr('x', jumpsMargin.left)
	    	.attr('y', function(d) { return mensYScale(mensjumparray.indexOf(d));})
	    	.attr("font-family", "Roboto")
	    	.attr("font-size", "12px")
	    	.attr("text-anchor", "start")
	    	.attr("alignment-baseline", "middle")

	    horizontallines.selectAll(".horizontalline")
	    	.data(mensjumparray)
	    	.enter()
			.append("line")
			.attr("class", 'y-axis-lines')
			.attr("transform", function(d,i) { return "translate(0," + mensYScale(mensjumparray.indexOf(d)) + ")";})
			.attr('x1', jumpsMargin.left + 30)
			.attr('y1', 0)
			.attr('x2', jumpsMenWidth)
			.attr('y2', 0);

		dividingline = currentsvg.append("g")
	    	.attr("class", "dividing-line")
	    dividingline.append("line")
	    	.attr("class", 'x-axis-lines')
			.attr("transform", function(d,i) { return "translate("+mensXScale(2.5) + ",0)";})
			.attr('x1', 0)
			.attr('y1', jumpsMargin.top)
			.attr('x2', 0)
			.attr('y2', jumpsMenHeight - jumpsMargin.bottom);
	    dividingline.append("line")
		/*skaterimages.selectAll("skater-images-img")
			.data*/
		skaterimages.selectAll(".skaterimages")
	
			.data(['images/skaters/' + skatername.split(" ")[0] + "sp.png?xxx=987878787",'images/skaters/' + skatername.split(" ")[0] + "fs.png?xxx=987878787"])
			.enter()
			.append("img")
			.attr("class", function(d, i) {
				if (i == 0) {
					return "skater-image-img sp";
				} else if (i == 1) {
					return "skater-image-img fs";
				}
			})

			.attr("src", function(d) { return d;})
			.style("top", jumpsMargin.top)

				

		var picked = (({spj1,spj2,spj3,fsj1,fsj2,fsj3,fsj4,fsj5,fsj6,fsj7,fsj8}) => ({spj1,spj2,spj3,fsj1,fsj2,fsj3,fsj4,fsj5,fsj6,fsj7,fsj8}))(mens[i])
		var goes = (({gspj1,gspj2,gspj3,gfsj1,gfsj2,gfsj3,gfsj4,gfsj5,gfsj6,gfsj7,gfsj8}) => ({gspj1,gspj2,gspj3,gfsj1,gfsj2,gfsj3,gfsj4,gfsj5,gfsj6,gfsj7,gfsj8}))(mens[i])
		var secondhalves = mens[i].secondhalf.split(",")

		for (var key in goes) {
		    if (goes.hasOwnProperty(key)) {

		    	goes[key] = d3.mean(JSON.parse(goes[key])).toFixed(2)

		    }
		}

		var result = Object.keys(picked).map(function(key) {
		  return [picked[key],goes['g'+key]];
		  //return picked[key];
		});
		for (var z = 0; z < result.length; z++) {
			result[z].push(secondhalves[z])
		}
		
		jumpsequence = jumpsequences.selectAll(".jump-sequence")
			.data(result)
			.enter()
			.append("g")
			.attr("class", "jump-sequence")
			.attr("transform", function(d,i) { return "translate(" + mensXScale(i) + ",0)";})
			.on('mouseover',function(d) {
				data = d
				jumpsmouseOverEvents(data, d3.select(this))
				d3.select(this).classed("hover", true);
			})
			.on('mouseout', function(d) {
				data = d
				jumpsmouseOutEvents(data, d3.select(this))
				d3.select(this).classed("hover", false);
			})
		jumpsequence.selectAll(".connectors")
			.data(function(d) { 
				var split = d[0].split("+");
				
				if (split.length > 1) { 
					var toReturn = []
					for (var j = 0; j < split.length-1; j++) {
						
						var combo = split.slice(j, j+2).join("+")
						toReturn.push(combo)
					}
					//console.log(toReturn)
					return toReturn;
				} else {
					return [];
				}
			})
			.enter()
			.append("line")
			.attr("class", "connector")
			.attr('x1', 0)
			.attr('y1', function(d) { return mensYScale(mensjumparray.indexOf(jumphelper(d.split("+")[0])))})
			.attr('x2', 0)
			.attr('y2', function(d) { return mensYScale(mensjumparray.indexOf(jumphelper(d.split("+")[1])))})

		
		jumpsequence.selectAll(".secondhalfs")
			.data(function(d) { 
		
				split = d[0].split("+")

				
				if (d[2] == "x") {
					var toReturn = []
					for (var j = 0; j < split.length; j++) {
						toReturn.push([split[j],d[1],d[2]])
					}
					return toReturn;
				} else {
					return [];
				}
			})
			.enter()
			.append("circle")
			.attr("r", function(d) { return bvscale(mensbvarray[mensjumparray.indexOf(jumphelper(d[0]))]) * 1.1;})
			.attr("class", "secondhalf")
			.attr("cy", function(d) { return mensYScale(mensjumparray.indexOf(jumphelper(d[0])))})
			//.style("fill","transpare")
			//.style("stroke-color", function(d) { return goescale(d[1]); })
			.style("stroke", function(d) { return goescale(d[1]); })
			.style("stroke-width", 1.5)
			
		
		jumpsequence.selectAll(".individualjumps")
			.data(function(d) { 
		
				split = d[0].split("+")
	
				var toReturn = []
				for (var j = 0; j < split.length; j++) {
					toReturn.push([split[j],d[1]])
				}

				return toReturn;
			})
			.enter()
			.append("circle")
			.attr("r", function(d) { return bvscale(mensbvarray[mensjumparray.indexOf(jumphelper(d[0]))]);})
			.attr("class", "individual-jump")
			.attr("cy", function(d) { return mensYScale(mensjumparray.indexOf(jumphelper(d[0])))})
			.style("fill", function(d) { return goescale(d[1]); })
			.style("stroke-width", 1.5)
								

		programlabels = currentsvg.append("g")
						.attr("class", "program-labels")
		labels = ["short program", "free skate"]
		programlabels.selectAll("program-labels")
			.data(labels)
			.enter()
			.append("text")
			.attr("class", "program-labels")
			.text(function(d) { return d;})
			.attr("x", function(d,i) {
				if (i == 0) {
					return mensXScale(1);
				} else {
					return mensXScale(6.5);
				}
				
			})
			.attr("y", jumpsMargin.top - 20)
			.attr("font-family", "Roboto")
	    	.attr("font-size", "12px")
	    	.attr("text-anchor", "start")
	    	.attr("text-anchor", "middle");
	}
	for (var i = 0; i < womens.length; i++) {
		console.log(womens[i])
		skatername = womens[i].skater;
		skatercountry = womens[i].country;
		

		var currentdiv = womendiv
			.append('div')
			.attr('class', 'skater-div')
		var numtriples = 0
		for (var key in womens[i]) {

		    if (womens[i].hasOwnProperty(key)) {

		    	splitjump = womens[i][key].split("+")
		    	for (var j = 0; j < splitjump.length; j++) {
	
		    		if (splitjump[j].charAt(0) == "3") {
		    			numtriples += 1
		    		}
		    	}
		       	
		    }
		}
		console.log(numtriples)
		header = currentdiv.append("div")
			.attr("class","header")
			
		quadsdiv = header.append("div")
			.attr("class","quadsdiv")
		
		
		quadsdiv.append('div')
				.text(numtriples)
				.attr("class", "numquads")
		quadjumps = quadsdiv.append('div')
			.attr("class", "quadjumps")
		
		quadjumps.append('span')
				.text("triple")
				.attr("class", "quad text")
		quadjumps.append('span')
				.text(function() {
					if (numtriples == 1) {
						return "jump";
					} else {
						return "jumps";
					}
				})
				.attr("class", "jumps text")
				
				

		namecountrydesc = header.append("div")
			.attr("class", "namecountrydesc")
		namecountry = namecountrydesc.append("div")
			.text(skatername)
			.attr("class","namecountry")
		namecountry.append("img")
			.attr('src', "images/"+ skatercountry+"flag.png")
		namecountrydesc.append("div")
			.text(mens[i].desc)
			.attr("class","desc")

		skaterimages = currentdiv.append("div")
			.attr("class", "skater-images")
		svgdiv = currentdiv.append('div')
			.attr("class", 'svg-div')
		currentsvg = svgdiv.append('svg')
			.attr('class', 'skater-svg')
			.attr('width', jumpsMenWidth)
			.attr('height', jumpsMenHeight)

		yaxis = currentsvg.append("g")
			.attr("class", "y-axis")
		
		horizontallines = currentsvg.append("g")
			.attr("class", "horizontal-lines")

		revolutions = yaxis.append("g")
			.attr("class", "revolutions")

		jumptype = yaxis.append("g")
			.attr("class", "jumptype")
		jumpsequences = currentsvg.append("g")
			.attr("class", "jump-sequences")

		currentrev = ""

		revolutions.selectAll('.revolution')
			.data(womensjumparray)
			.enter()
			.append("text")
			.text(function(d) {
				if (d.split(" ")[0] != currentrev) {
					currentrev = d.split(" ")[0];
					return d.split(" ")[0];

				} else {
					return "";
				}
			})
			.attr('x', jumpsMargin.left-5)
	    	.attr('y', function(d) { return womensYScale(womensjumparray.indexOf(d));})
	    	.attr("font-family", "Roboto")
	    	.attr("font-size", "12px")
	    	.attr("text-anchor", "end")
	    	.attr("font-weight", 900)
	    	.attr("alignment-baseline", "middle")
		jumptype.selectAll('.jumptype')
			.data(womensjumparray)
			.enter()
			.append("text")
			.text(function(d) {
				return d.split(" ")[1];
			})
			.attr('x', jumpsMargin.left)
	    	.attr('y', function(d) { return womensYScale(womensjumparray.indexOf(d));})
	    	.attr("font-family", "Roboto")
	    	.attr("font-size", "12px")
	    	.attr("text-anchor", "start")
	    	.attr("alignment-baseline", "middle")

	    horizontallines.selectAll(".horizontalline")
	    	.data(mensjumparray)
	    	.enter()
			.append("line")
			.attr("class", 'y-axis-lines')
			.attr("transform", function(d,i) { return "translate(0," + womensYScale(mensjumparray.indexOf(d)) + ")";})
			.attr('x1', jumpsMargin.left + 30)
			.attr('y1', 0)
			.attr('x2', jumpsMenWidth)
			.attr('y2', 0);

		dividingline = currentsvg.append("g")
	    	.attr("class", "dividing-line")
	    dividingline.append("line")
	    	.attr("class", 'x-axis-lines')
			.attr("transform", function(d,i) { return "translate("+womensXScale(2.5) + ",0)";})
			.attr('x1', 0)
			.attr('y1', jumpsMargin.top)
			.attr('x2', 0)
			.attr('y2', jumpsMenHeight - jumpsMargin.bottom);
	    dividingline.append("line")
		/*skaterimages.selectAll("skater-images-img")
			.data*/
		skaterimages.selectAll(".skaterimages")
	
			.data(['images/skaters/' + skatername.split(" ")[0] + "sp.png?xxx=987878787",'images/skaters/' + skatername.split(" ")[0] + "fs.png?xxx=987878787"])
			.enter()
			.append("img")
			.attr("class", function(d, i) {
				if (i == 0) {
					return "skater-image-img sp";
				} else if (i == 1) {
					return "skater-image-img fs";
				}
			})

			.attr("src", function(d) { return d;})
			.style("top", jumpsMargin.top)

				

		var picked = (({spj1,spj2,spj3,fsj1,fsj2,fsj3,fsj4,fsj5,fsj6,fsj7}) => ({spj1,spj2,spj3,fsj1,fsj2,fsj3,fsj4,fsj5,fsj6,fsj7}))(womens[i])
		var goes = (({gspj1,gspj2,gspj3,gfsj1,gfsj2,gfsj3,gfsj4,gfsj5,gfsj6,gfsj7}) => ({gspj1,gspj2,gspj3,gfsj1,gfsj2,gfsj3,gfsj4,gfsj5,gfsj6,gfsj7}))(womens[i])
		var secondhalves = womens[i].secondhalf.split(",")

		for (var key in goes) {
		    if (goes.hasOwnProperty(key)) {

		    	goes[key] = d3.mean(JSON.parse(goes[key])).toFixed(2)

		    }
		}

		var result = Object.keys(picked).map(function(key) {
		  return [picked[key],goes['g'+key]];
		  //return picked[key];
		});
		for (var z = 0; z < result.length; z++) {
			result[z].push(secondhalves[z])
		}
		
		jumpsequence = jumpsequences.selectAll(".jump-sequence")
			.data(result)
			.enter()
			.append("g")
			.attr("class", "jump-sequence")
			.attr("transform", function(d,i) { return "translate(" + womensXScale(i) + ",0)";})
			.on('mouseover',function(d) {
				data = d
				jumpsmouseOverEvents(data, d3.select(this))
				d3.select(this).classed("hover", true);
			})
			.on('mouseout', function(d) {
				data = d
				jumpsmouseOutEvents(data, d3.select(this))
				d3.select(this).classed("hover", false);
			})
		jumpsequence.selectAll(".connectors")
			.data(function(d) { 
				var split = d[0].split("+");
				
				if (split.length > 1) { 
					var toReturn = []
					for (var j = 0; j < split.length-1; j++) {
						
						var combo = split.slice(j, j+2).join("+")
						toReturn.push(combo)
					}
					//console.log(toReturn)
					return toReturn;
				} else {
					return [];
				}
			})
			.enter()
			.append("line")
			.attr("class", "connector")
			.attr('x1', 0)
			.attr('y1', function(d) { return womensYScale(womensjumparray.indexOf(jumphelper(d.split("+")[0])))})
			.attr('x2', 0)
			.attr('y2', function(d) { return womensYScale(womensjumparray.indexOf(jumphelper(d.split("+")[1])))})

		
		jumpsequence.selectAll(".secondhalfs")
			.data(function(d) { 
		
				split = d[0].split("+")

				console.log(d);
				if (d[2] == "x") {
					var toReturn = []
					for (var j = 0; j < split.length; j++) {
						toReturn.push([split[j],d[1],d[2]])
					}
			
					return toReturn;
				} else {
					return [];
				}
			})
			.enter()
			.append("circle")
			.attr("r", function(d) { return bvscale(womensbvarray[womensjumparray.indexOf(jumphelper(d[0]))]) * 1.1;})
			.attr("class", "secondhalf")
			.attr("cy", function(d) { return womensYScale(womensjumparray.indexOf(jumphelper(d[0])))})
			//.style("fill","transpare")
			//.style("stroke-color", function(d) { return goescale(d[1]); })
			.style("stroke", function(d) { return goescale(d[1]); })
			.style("stroke-width", 1.5)
			
		
		jumpsequence.selectAll(".individualjumps")
			.data(function(d) { 
		
				split = d[0].split("+")
	
				var toReturn = []
				for (var j = 0; j < split.length; j++) {
					toReturn.push([split[j],d[1]])
				}

				return toReturn;
			})
			.enter()
			.append("circle")
			.attr("r", function(d) { return bvscale(womensbvarray[womensjumparray.indexOf(jumphelper(d[0]))]);})
			.attr("class", "individual-jump")
			.attr("cy", function(d) { return womensYScale(womensjumparray.indexOf(jumphelper(d[0])))})
			.style("fill", function(d) { return goescale(d[1]); })
			.style("stroke-width", 1.5)
								

		programlabels = currentsvg.append("g")
						.attr("class", "program-labels")
		labels = ["short program", "free skate"]
		programlabels.selectAll("program-labels")
			.data(labels)
			.enter()
			.append("text")
			.attr("class", "program-labels")
			.text(function(d) { return d;})
			.attr("x", function(d,i) {
				if (i == 0) {
					return womensXScale(1);
				} else {
					return womensXScale(6);
				}
				
			})
			.attr("y", jumpsMargin.top - 20)
			.attr("font-family", "Roboto")
	    	.attr("font-size", "12px")
	    	.attr("text-anchor", "start")
	    	.attr("text-anchor", "middle");
		
	}
	function jumpsmouseOverEvents(data, element) {
	    
	    	jumpstooltip
					
							.text(function () { return data; })
			jumpstooltip
          .style("visibility","visible")
          .style("top",function(d){
            /*if(viewportWidth < 450 || mobile){
              return "250px";
            }*/
           return (d3.event.pageY)+ 15+"px"
           //return 3600+"px"
          })
          .style("left",function(d){
            /*if(viewportWidth < 450 || mobile){
              return "0px";
            }*/
            return (d3.event.pageX) +"px";
          })
	    }
	    function jumpsmouseOutEvents(data, element) {
	    	jumpstooltip
	       		.style("visibility",null);
		}
	function jumphelper(abbrev) {
		var revs = abbrev.substring(0,1)
		var jump = abbrev.substring(1)

		return revobj[revs] + " " + jumpobj[jump]


	}
}