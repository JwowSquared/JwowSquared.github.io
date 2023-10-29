async function fetchData() {
	try {
		let request = new Request(`https://raw.githubusercontent.com/${repo}/master/data.json`);
		
		const cache = await caches.open(version);
		
		let response = await cache.match(request);
		if (!response) {
			response = await fetch(request);
			await cache.put(request, response);
		}
			response = await cache.match(request);
		
		let data = await response.json();
		species = data.species;
		moves = data.moves;
		abilities = data.abilities;
		locations = data.locations;
		eggGroups = data.eggGroups;
		types = data.types;
		splits = data.splits;
		evolutionItems = data.evolutionItems;
		heldItems = data.heldItems;
		caps = data.caps;
		sprites = data.sprites;
		evolutions = data.evolutions;
		regions = data.regions;
		stats = data.stats;
	}
	catch (e) {
		console.log(e);
		return;
	}
	loadingScreen.className = "hide";
	document.querySelector("main").className = "";
}

async function onStartup() {
	
	await fetchData();
	
	setupTables();
	
	setupFilters();
}

function loadChunk(tracker, toClear) {
	let rowsAdded = 0;
	
	if (toClear) {
		if (scrollIntoView && tracker.body.getBoundingClientRect().top < 0)
			tracker.body.scrollIntoView({behavior: "smooth", block: "start"});
		tracker.body.innerText = "";
		tracker.index = 0;
	}
	
	let data = tracker.data;
	let i = tracker.index;
	for (j = data.length, k = tracker.maxRows; rowsAdded < k && i < j; i++) {
		tracker.displayMethod(tracker, data[i]);
		rowsAdded++;
	}
	tracker.index = i;
}

onStartup();