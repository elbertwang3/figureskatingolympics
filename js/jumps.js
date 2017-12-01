d3.queue()
    .defer(d3.csv, "data/mens.csv")
    .defer(d3.csv, "data/womens.csv")
    .await(ready);
  
   

function ready(error,mens, womens) {
	console.log("hi");
	console.log(mens);
	console.log(womens);
	
}