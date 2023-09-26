function setupTables() {
	setupTable("speciesLearnsetPrevoExclusiveTable", moves, displayLevelUpMovesRow, Object.keys(moves).length, sortLevelUpMovesRow, [
		["Lvl", ["level"]],
		["Name", ["name"]],
		["Type", ["type"]],
		["Category", ["split"]],
		["Power", ["power"]],
		["Acc", ["accuracy"]]
	]);
	
	setupTable("speciesLearnsetLevelUpTable", moves, displayLevelUpMovesRow, Object.keys(moves).length, sortLevelUpMovesRow, [
		["Lvl", ["level"]],
		["Name", ["name"]],
		["Type", ["type"]],
		["Category", ["split"]],
		["Power", ["power"]],
		["Acc", ["accuracy"]]
	]);
	
	setupTable("speciesLearnsetTMHMTable", moves, displayMovesRow, Object.keys(moves).length, sortMovesRow, [
		["Name", ["name"]],
		["Type", ["type"]],
		["Category", ["split"]],
		["Power", ["power"]],
		["Acc", ["accuracy"]]
	]);
	
	setupTable("speciesLearnsetTutorTable", moves, displayMovesRow, Object.keys(moves).length, sortMovesRow, [
		["Name", ["name"]],
		["Type", ["type"]],
		["Category", ["split"]],
		["Power", ["power"]],
		["Acc", ["accuracy"]]
	]);
	
	setupTable("speciesLearnsetEggMovesTable", moves, displayMovesRow, Object.keys(moves).length, sortMovesRow, [
		["Name", ["name"]],
		["Type", ["type"]],
		["Category", ["split"]],
		["Power", ["power"]],
		["Acc", ["accuracy"]]
	]);
	
	setupTable("speciesTable", species, displaySpeciesRow, 50, sortSpeciesRow, [
		["#", ["dexID"]],
		["Sprite", []],
		["Name", ["name"]],
		["Type", []],
		["Abilities", ["abilities", "primary"]],
		["HP", ["stats", "HP"]],
		["Atk", ["stats", "attack"]],
		["Def", ["stats", "defense"]],
		["SpA", ["stats", "specialAttack"]],
		["SpD", ["stats", "specialDefense"]],
		["Spe", ["stats", "speed"]],
		["BST", ["stats", "total"]]
	]);
	
	populateTable("speciesTable", Object.keys(species));
	
	window.onscroll = function(ev) {
		if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
		loadChunk(trackers["speciesTable"], false);
		}
	};
}

function setupTable(name, library, displayMethod, maxRows, sortMethod, sortOptions) {
	let wrapper = document.getElementById(name);
	if (!wrapper) {
		console.log(`Table ${name} could not be created, wrapper missing.`);
		return;
	}
	let table = document.createElement("table");
	let thead = document.createElement("thead");
	let tbody = document.createElement("tbody");
	table.className = "align-middle table table-striped table-dark table-hover";
	table.append(thead);
	table.append(tbody);
	wrapper.append(table);
	
	trackers[name] = {};
	let tracker = trackers[name];
	tracker.body = tbody;
	tracker.library = library;
	tracker.displayMethod = displayMethod;
	tracker.maxRows = maxRows;
	
	let sortControls = document.createElement("tr");
	sortControls.className = "sortControls";
	thead.append(sortControls);
	
	for (const [sortLabel, sortProperties] of sortOptions) {
		let sortOption = document.createElement("th");
		sortControls.append(sortOption);
		sortOption.innerText = sortLabel;
		sortOption.className = "sortLocked";
		if (sortProperties.length === 0)
			continue;
		sortOption.className = "sortOption";
		sortOption.onclick = function () {
			sortTracker(this, trackers[name], sortMethod, sortProperties);
		};
	}
	tracker.sortControls = sortControls.getElementsByClassName("sortOption");
}

function populateTable(name, data) {
	let tracker = trackers[name];
	if (!tracker) {
		console.log(`Tracker ${name} does not exist; cannot populate.`);
		return;
	}
	
	tracker.data = data;
	for (const control of tracker.sortControls)
		control.className = "sortOption";
	tracker.sortControls[0].click();
}

function sortTracker(selectedOption, tracker, sortMethod, sortProperties) {
	let prevClass = selectedOption.className;
	
	for (const option of tracker.sortControls)
		option.className = "sortOption";
	
	selectedOption.className = "sortOption active sortAscending";
	
	if (prevClass === "sortOption") {
		sortMethod(tracker, sortProperties);
	}
	else {
		if (prevClass === "sortOption active sortAscending") {
			selectedOption.className = "sortOption active sortDescending";
		}
	
		tracker.data.reverse();
	}
	
	loadChunk(tracker, true);
}