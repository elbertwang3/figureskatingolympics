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
	step.style('width', stepWidth + 'px');
	// 2. update width/height of graphic element
	var bodyWidth = d3.select('body').node().offsetWidth;
	graphic
		.style('width', bodyWidth + 'px')
		.style('height', window.innerHeight + 'px');


	var chartMargin = 32;
	var textWidth = text.node().offsetWidth;
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
		
		chart.select('img').attr('src', data[response.index].gif);

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
		/*debug: true,*/
	})
		.onStepEnter(handleStepEnter)
		.onContainerEnter(handleContainerEnter)
		.onContainerExit(handleContainerExit);
	// setup resize event
	d3.csv('data/jumps.csv', function(data) {
		console.log(data);
		for (var i = 1; i <= 6; i++) {
			currDiv = d3.select("[data-step='" + i + "']")
			console.log(currDiv);
			currDiv.select('h3').text('the ' + data[i-1].jump)
			currDiv.select('.type').text(data[i-1].type);
			currDiv.select('.takeoff').text(data[i-1].takeoff);
			currDiv.select('.landing').text(data[i-1].landing);
			currDiv.select('.direction').text(data[i-1].direction);
			currDiv.select('img').attr('src', data[i-1].image);
		}
	})
		
	window.addEventListener('resize', handleResize);
}
// kick things off
init();