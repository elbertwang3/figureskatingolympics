var jumpsWomenWidth = 450,
jumpsMenWidth = 470,
jumpsWomenHeight = 300,
jumpsMenHeight = 350,
jumpsMargin = {top: 30, bottom: 30, right: 30, left: 60},
mendiv = d3.select(".jumpsmen"),
womendiv = d3.select(".jumpswomen"),
mensjumparray = ['Quad Lutz', 'Quad Flip', 'Quad Loop', 'Quad Sal', 'Quad Toe', 'Triple Axel', 'Triple Lutz', 'Triple Flip','Triple Loop', 'Triple Sal', 'Triple Toe', 'Double Axel', 'Double Loop', 'Double Toe', 'Single Loop'],
womensjumparray = ['Triple Axel', 'Triple Lutz', 'Triple Flip','Triple Loop', 'Triple Sal', 'Triple Toe', 'Double Axel', 'Double Loop', 'Double Toe', 'Single Loop'],
revobj = {1 : 'Single', 2 : 'Double', 3 : "Triple", 4 : 'Quad'}
jumpobj = {'A' : "Axel", "Lz":"Lutz", "F":"Flip", "S":"Sal",'Lo':"Loop", "T":"Toe"}

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
		.range([jumpsMargin.top, jumpsWomenHeight-jumpsMargin.bottom])

	var mensXScale = d3.scaleLinear()
		.domain([0,10])
		.range([jumpsMargin.left+45, jumpsMenWidth-jumpsMargin.right+15])

	var womensXScale = d3.scaleLinear()
		.domain([0,9])
		.range([jumpsMargin.left+30, jumpsWomenWidth-jumpsMargin.right])

	var goescale = d3.scaleLinear()
		.domain([-3,3])
		.range([1,8])

	for (var i = 0; i < mens.length; i++) {
		skatername = mens[i].skater;
		skatercountry = mens[i].country;
		

		currentdiv = mendiv
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
		console.log(numquads);
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

		var picked = (({spj1,spj2,spj3,fsj1,fsj2,fsj3,fsj4,fsj5,fsj6,fsj7,fsj8}) => ({spj1,spj2,spj3,fsj1,fsj2,fsj3,fsj4,fsj5,fsj6,fsj7,fsj8}))(mens[i])
		//var goes = (({gspj1,gspj2,gspj3,gfsj1,gfsj2,gfsj3,gfsj4,gfsj5,gfsj6,gfsj7,gfsj8}) => ({gspj1,gspj2,gspj3,gfsj1,gfsj2,gfsj3,gfsj4,gfsj5,gfsj6,gfsj7,gfsj8}))(mens[i])
		var result = Object.keys(picked).map(function(key) {
		  //return [picked[key],goes[g+key]];
		  return picked[key];
		});
		jumpsequence = jumpsequences.selectAll(".jump-sequence")
			.data(result)
			.enter()
			.append("g")
			.attr("class", "jump-sequence")
			.attr("transform", function(d,i) { return "translate(" + mensXScale(i) + ",0)";})



		
		jumpsequence.selectAll("circle")
			.data(function(d) { return d.split("+");})
			.enter()
			.append("circle")
			.attr("r", 5)
			.attr("class", "individual-jump")
			.attr("cy", function(d) { return mensYScale(mensjumparray.indexOf(jumphelper(d)))})

			.style("stroke-width", 1)
			.on('mouseover',function(d) {
					d3.select(this).classed("hover", true);
			})
			.on('mouseout', function(d) {
				d3.select(this).classed("hover", false);
			})
		jumpsequence.selectAll("connectors")
			.data(function(d) { 

				var split = d.split("+");
				
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
			/*.attr('x1', 0)
			.attr('y1', function(d) { })
			.attr('x2', 0)
			.attr('y2', function(d) { });*/
						

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
					return mensXScale(0);
				} else {
					return mensXScale(3);
				}
				
			})
			.attr("y", jumpsMargin.top - 10)
			.attr("font-family", "Roboto")
	    	.attr("font-size", "12px")
	    	.attr("text-anchor", "start")

	}
	for (var i = 0; i < womens.length; i++) {
		
	}
	
	function jumphelper(abbrev) {
		var revs = abbrev.substring(0,1)
		var jump = abbrev.substring(1)
		return revobj[revs] + " " + jumpobj[jump]


	}
}