function getData() {
	return fetch('static/data/data.json')
	    .then( (response) => {
	    	return response.json()
	    })
}


function createLanguageTable() {
	getData().then( data => {
		let languages = data.languages;
		let maxYears = Math.max.apply(Math, languages.map( item => { return item.years; } ));
		
		let rows = d3.select('table#languages tbody')
			.selectAll('tr')
			.data(languages)
			.enter().append('tr');
			
		rows.append('td')
		    .text( (d) => { return d.name; } );

		let x = d3.scaleLinear()
		    .domain([0, maxYears])
		    .range([0, '95%']);

		let bars = rows
			.append('td')
			.append('svg')
			    .attr('height', '25px')
			.append('g')
			.attr('transform', (d, i) => { return `translate(0, 0)` });
			
			bars.append('rect')
			    .attr('width', 0)
			    .transition()
			    .duration(1000)
			    .attr('width', (d) => { return `${d.years / maxYears * 100}%`; })
			    .attr('height', 20);

			bars.append('text')
				.attr('x', (d) => { return x(d.years)  ;})
				.attr('y', 15)
			    .text( (d) => { return d.years } );
	});
}

function isInViewport(element) {
	var rect = element.getBoundingClientRect();
	var html = document.documentElement;
	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= (window.innerHeight || html.clientHeight) &&
		rect.right <= (window.innerWidth || html.clientWidth)
	);
}

var languages = document.getElementById('languages');
function scrollHandler(event) {
	if (isInViewport(languages)) {
		languages.style.visibility = 'visible';
		createLanguageTable();
		document.removeEventListener('scroll', scrollHandler);
	}
};

document.addEventListener('scroll', scrollHandler);
document.addEventListener('DOMContentLoaded', (event) => {
	if (isInViewport(languages)) {
		scrollHandler()
	}
});