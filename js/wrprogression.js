d3.queue()
    .defer(d3.csv, "data/menswr.csv")
    .defer(d3.csv, "data/womenswr.csv")
    .await(ready);

function ready(error,menswr, womenswr) {
	console.log(menswr);
	console.log(womenswr);
}