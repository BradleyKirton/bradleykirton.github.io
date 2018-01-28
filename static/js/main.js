function getData() {
	return fetch(`static/data/data.json?${Date.now()}`)
	    .then( (response) => {
	    	return response.json()
	    })
}

function createExperienceTable(tableId) {
	getData().then( data => {
		let currentYear = new Date(Date.now()).getFullYear();
		let experience = data[tableId];
		let maxYears = Math.max.apply(Math, experience.map( item => { return currentYear - item.year; } ));
		
		let rows = d3.select(`table#${tableId} tbody`)
			.selectAll('tr')
			.data(experience)
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
			
			let rects = bars.append('rect')
			    .attr('width', 0)
			    .transition()
			    .duration(1000)
			    .attr('title', (d) => { return `${d.tooltip}`; })
			    .attr('width', (d) => { return `${(currentYear - d.year) / maxYears * 100}%`; })
			    .attr('height', 20);

			bars.append('title')
			    .text( (d) => { return d.tooltip; });

			bars.append('text')
				.attr('x', (d) => { return x(currentYear - d.year)  ;})
				.attr('y', 15)
			    .text( (d) => { return currentYear - d.year } );
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

function languageScrollHandler(event) {
	if (isInViewport(languages)) {
		languages.style.visibility = 'visible';
		createExperienceTable(languages.id);
		document.removeEventListener('scroll', languageScrollHandler);
	}
}

function libraryScrollHandler(event) {
	if (isInViewport(libraries)) {
		libraries.style.visibility = 'visible';
		createExperienceTable(libraries.id);
		document.removeEventListener('scroll', libraryScrollHandler);
	}
}

document.addEventListener('DOMContentLoaded', (event) => {
	let languages = document.getElementById('languages');
	let libraries = document.getElementById('libraries');
	
	function renderTable(table) {
		if (isInViewport(table)) {
			table.style.visibility = 'visible';
			
			createExperienceTable(table.id);
		} else {
			document.addEventListener('scroll', languageScrollHandler);
			document.addEventListener('scroll', libraryScrollHandler);
		}
	}

	renderTable(languages);
	renderTable(libraries);
});