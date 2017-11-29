// using d3 for convenience
var container = d3.select('#scroll');
var graphic = container.select('.scroll__graphic');
var chart = graphic.select('.chart');
var text = container.select('.scroll__text');
var step = text.selectAll('.step');
// initialize the scrollama
var scroller = scrollama();
// generic window resize listener event
function handleResize() {
	// 1. update height of step elements
	var stepWidth = Math.floor(window.innerWidth/2);
	console.log(stepWidth);
	step.style('width', stepWidth + 'px');
	// 2. update width/height of graphic element
	var bodyWidth = d3.select('body').node().offsetWidth;
	graphic
		.style('width', bodyWidth + 'px')
		.style('height', window.innerHeight + 'px');
	console.log(bodyWidth);
	console.log(graphic.node().offsetWidth)

	var chartMargin = 32;
	var textWidth = text.node().offsetWidth;
		console.log(textWidth);
	var chartWidth = graphic.node().offsetWidth - textWidth - chartMargin;
	chart
		.style('width', chartWidth + 'px')
		.style('height', Math.floor(window.innerHeight/2) + 'px');
	// 3. tell scrollama to update new element dimensions
	scroller.resize();
}
// scrollama event handlers
function handleStepEnter(response) {
	// response = { element, direction, index }
	// add color to current step only
	step.classed('is-active', function (d, i) {
		return i === response.index;
	})
	// update graphic based on step
	d3.csv('data/jumps.csv', function(data) {
		chart.select('h3').text('the ' + data[response.index].jump)
		console.log(chart.select('p'))
		console.log(chart.select('.type'));
		chart.select('.type').text(data[response.index].type);
		chart.select('.takeoff').text(data[response.index].takeoff);
		chart.select('.landing').text(data[response.index].landing);
		chart.select('.direction').text(data[response.index].direction);
		chart.select('img').attr('src', data[response.index].image);

	});
	
}
function handleContainerEnter(response) {
	// response = { direction }
	// sticky the graphic (old school)
	graphic.classed('is-fixed', true);
	graphic.classed('is-bottom', false);
}
function handleContainerExit(response) {
	// response = { direction }
	// un-sticky the graphic, and pin to top/bottom of container
	graphic.classed('is-fixed', false);
	graphic.classed('is-bottom', response.direction === 'down');
}
function init() {
	// 1. force a resize on load to ensure proper dimensions are sent to scrollama
	handleResize();
	// 2. setup the scroller passing options
	// this will also initialize trigger observations
	// 3. bind scrollama event handlers (this can be chained like below)
	scroller.setup({
		container: '#scroll',
		graphic: '.scroll__graphic',
		text: '.scroll__text',
		step: '.scroll__text .step',
		debug: true,
	})
		.onStepEnter(handleStepEnter)
		.onContainerEnter(handleContainerEnter)
		.onContainerExit(handleContainerExit);
	// setup resize event
	window.addEventListener('resize', handleResize);
}
// kick things off
init();