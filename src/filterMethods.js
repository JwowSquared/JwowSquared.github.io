let speciesInput = document.getElementById("speciesFilterInput");
let inputDropdown = document.getElementById("speciesFilterInputDropdown");
let inputWrapper = document.getElementById("speciesFilterInputWrapper");
let selectFilterCategory = document.getElementById("speciesFilterCategory");
let categoryDropdown = document.getElementById("speciesFilterCategoryDropdown");
let categoryWrapper = document.getElementById("speciesFilterCategoryWrapper");
let selectedFilter = null;

function setupFilters() {

	let toggles = {
		"CHANGED": {name: "Changed"},
		"LEVELUP": {name: "Levelup"},
		"EVOLVED": {name: "Evolved"},
		"EVIOLITE": {name: "Eviolite"},
		"HARDCORE": {name: "Hardcore"},
		"ONLYNEW": {name: "Only New"},
		"REGIONAL": {name: "Regional"},
		"MEGA": {name: "Mega"}
	};

	let filterConfigs = [
		["Name", filterName, 1, species],
		["Region", filterRegion, 1, regions],
		["Type", filterType, 2, types],
		["Move", filterMove, 4, moves],
		["Move Type", filterMoveType, 1, types],
		["Ability", filterAbilities, 1, abilities],
		["Egg Group", filterEggGroup, 1, eggGroups],
		["Held Item", filterHeldItem, 1, heldItems],
		["Level Cap", filterLevelCap, 1, caps],
		["Toggle", filterToggle, 7, toggles]
	];
	
	for (const [name, filter, max, library] of filterConfigs) {
		filters[name] = buildFilter(name, filter, max, library);
	}

	function sortByName(a, b) { return a[1] == b[1] ? 0 : a[1] < b[1] ? -1 : 1; }
	filters["Move"].options.sort(sortByName);
	filters["Ability"].options.sort(sortByName);
	filters["Egg Group"].options.sort(sortByName);
	filters["Held Item"].options.sort(sortByName);
	for (const option of filters["Name"].options)
		option[1] = fullSpeciesName(option[0]);
	filters["Toggle"].toggles = {};
	
	selectFilterCategory.value = filterConfigs[0][0];
	let options = filterConfigs.map(x => x[0]);
	categoryDropdown.className = "hide";
	for (let i = 0; i < options.length; i++) {
		let option = document.createElement("li");
		option.innerText = options[i];
		option.addEventListener("mousedown", function() {
			selectFilterCategory.value = option.innerText;
			selectedFilter = filters[option.innerText];
			speciesInput.value = "";
			selectFilterCategory.className = "";
			categoryDropdown.className = "hide";
		});
		categoryDropdown.append(option);
	}
	selectFilterCategory.addEventListener("mousedown", function(event) {
		event.preventDefault();
		selectFilterCategory.className = "highlight";
		categoryDropdown.className = "";
	});
	categoryWrapper.addEventListener("mouseleave", function(event) {
		event.preventDefault();
		selectFilterCategory.className = "";
		categoryDropdown.className = "hide";
	});
	
	filters.active = {};
	selectedFilter = filters["Name"];

	speciesInput.addEventListener("keyup", buildDropdown);
	speciesInput.addEventListener("mousedown", buildDropdown);
	inputWrapper.addEventListener("mouseleave", function(event) {
		event.preventDefault();
		speciesInput.blur();
		inputDropdown.innerHTML = "";
	});

	speciesInput.addEventListener("change", function(event) {
		event.preventDefault();
		let input = speciesInput.value.trim().toLowerCase();
		
		let option = selectedFilter.options.find(x => x[1].toLowerCase() === input);
		if (option) {
			selectedFilter.filter(option);
			speciesInput.value = "";
		}
	});
}

function buildDropdown(event) {
	let input = speciesInput.value.trim().toLowerCase();
	let options = selectedFilter.options.filter(x => x[1].toLowerCase().includes(input));
	inputDropdown.innerHTML = "";
	for (let i = 0; i < options.length; i++) {
		let option = document.createElement("li");
		option.innerText = options[i][1];
		option.addEventListener("mousedown", function() {
			selectedFilter.filter(options[i]);
			speciesInput.value = "";
		});
		inputDropdown.append(option);
	}
}

function buildFilter(name, filter, max, library) {
	let basic = {};
	basic.ID = "filter" + name;
	basic.name = name;
	basic.filter = filter;
	basic.max = max;
	basic.options = Object.keys(library).map(x => [x, library[x].name]);
	basic.active = [];
	return basic;
}

function filterName(option) {
	let func = x => x === option[0];
	addFilter(filters["Name"], option, func);
}

function filterRegion(option) {
	let func = x => species[x].family.region === option[0];
	addFilter(filters["Region"], option, func);
}

function filterType(option) {
	let func = x => species[x].type.primary === option[0] || species[x].type.secondary === option[0];
	addFilter(filters["Type"], option, func);
}

function filterMove(option) {
	let filter = filters["Move"];
	
	if (option === "RECALC") {
		let activeFilters = [...filter.active];
		for (const activeFilter of activeFilters)
			filterMove(activeFilter);
		return;
	}

	let func = function(x) {
		let learnset = species[x].learnset;
		let found = false;
		for (const key in learnset) {
			if (key === "levelup" || key === "prevo")
				found = learnset.levelup.find(y => y[0] === option[0]);
			else
				found = learnset[key].find(y => y === option[0]);
			if (found)
				return true;
		}
		return false;
	}
	
	let toggles = filters["Toggle"].toggles;
	if (toggles.LEVELUP)
		func = x => species[x].learnset.levelup.find(y => y[0] === option[0]) || (species[x].learnset.prevo && species[x].learnset.prevo.find(y => y[0] === option[0]));

	addFilter(filter, option, func);
}

function filterMoveType(option) {
	let filter = filters["Move Type"];
	
	if (option === "RECALC") {
		let activeFilters = [...filter.active];
		for (const activeFilter of activeFilters)
			filterMoveType(activeFilter);
		return;
	}
	
	let func = function(x) {
		let learnset = species[x].learnset;
		let found = false;
		for (const key in learnset) {
			if (key === "levelup" || key === "prevo")
				found = learnset.levelup.find(y => moves[y[0]].type === option[0] && moves[y[0]].power > 0);
			else
				found = learnset[key].find(y => moves[y].type === option[0] && moves[y].power > 0);
			if (found)
				return true;
		}
		return false;
	}
	
	let toggles = filters["Toggle"].toggles;
	if (toggles.LEVELUP)
		func = x => species[x].learnset.levelup.find(y => moves[y[0]].type === option[0]) || species[x].learnset.prevo.find(y => moves[y[0]].type === option[0]);
	
	addFilter(filter, option, func);
}

function filterAbilities(option) {
	let func = x => species[x].abilities.primary === option[0] || species[x].abilities.secondary === option[0] || species[x].abilities.hidden === option[0];
	addFilter(filters["Ability"], option, func);
}

function filterEggGroup(option) {
	let func = x => species[x].family.eggGroup.primary === option[0] || species[x].family.eggGroup.secondary === option[0];
	addFilter(filters["Egg Group"], option, func);
}

function filterHeldItem(option) {
	let func = x => species[x].items != null && (species[x].items.common === option[0] || species[x].items.rare === option[0]);
	addFilter(filters["Held Item"], option, func);
}

function filterLevelCap(option) {
	let filter = filters["Level Cap"];

	if (option === "RECALC") {
		let activeFilters = [...filter.active];
		for (const activeFilter of activeFilters)
			filterLevelCap(activeFilter);
		return;
	}

	let toggles = filters["Toggle"].toggles;
	
	let difficulty = "normal";
	if (toggles.HARDCORE)
		difficulty = "hardcore";

	if (toggles.ONLYNEW)
		func = x => species[x].cap[difficulty] == option[0];
	else
		func = x => species[x].cap[difficulty] <= option[0];

	if (toggles.EVOLVED)
		filters.active.EVOLVED.func = x => !("evolutions" in species[x].family) || !(species[x].family.evolutions.find(y => species[y[2]].cap[difficulty] <= option[0]));

	addFilter(filter, option, func);
	filters.active[option[0]].tag.onclick = function() {
		if (toggles.EVOLVED)
			filters.active.EVOLVED.func = x => !species[x].family.evolutions;
		removeFilter(filter, option);
	};
}

function filterToggle(option) {
	let filter = filters["Toggle"];
	let toggles = filter.toggles;

	let func = x => true;
	if (option[0] === "CHANGED")
		func = x => species[x].changelog != null;
	else if (option[0] === "EVOLVED" && filters["Level Cap"].active.length === 0)
		func = x => !species[x].family.evolutions;
	else if (option[0] === "REGIONAL")
		func = x => species[x].family.forms && species[species[x].family.forms[0]].family.region !== species[x].family.region;
	else if (option[0] === "MEGA")
		func = x => species[x].family.form && species[x].family.form.includes("Mega");
	else if (option[0] === "EVIOLITE")
		func = x => species[x].family.evolutions && species[x].family.evolutions.filter(x => !(x[0] === "MEGA")).length > 0;

	if (toggles[option[0]] === true) {
		toggles[option[0]] = false;
		removeFilter(filter, option);
	}
	else {
		toggles[option[0]] = true;
		addFilter(filter, option, func);
		filters.active[option[0]].tag.onclick = function() {
			toggles[option[0]] = false;
			if (option[0] === "EVOLVED" || option[0] === "HARDCORE" || option[0] === "ONLYNEW")
				filterLevelCap("RECALC");
			if (option[0] === "LEVELUP") {
				filterMove("RECALC");
				filterMoveType("RECALC");
			}
			removeFilter(filter, option);
		};
	}

	if (option[0] === "EVOLVED" || option[0] === "HARDCORE" || option[0] === "ONLYNEW")
		filterLevelCap("RECALC");
	if (option[0] === "LEVELUP") {
		filterMove("RECALC");
		filterMoveType("RECALC");
	}
}

function addFilter(filter, option, func) {

	if (filters.active[option[0]] && filters.active[option[0]].func !== func) {
		removeFilter(filter, option);
	}

	filter.active.push(option);
	
	if (filter.active.length > filter.max) {
		removeFilter(filter, filter.active[0]);
	}

	let activeFiltersDisplay = document.getElementById("activeFilters");
	let button = document.createElement("div");
	button.textContent = `${filter.name}: ${option[1]}`;
	button.className = "activeFilter";
	button.onclick = function() {
		removeFilter(filter, option);
	};
	activeFiltersDisplay.append(button);

	filters.active[option[0]] = {tag: button, func: func};

	let results = Object.keys(species);
	for (const pair of Object.values(filters.active))
		results = results.filter(pair.func);
	
	populateTable("speciesTable", results);

	if (results.length === 1 && filter.name === "Name") {
		let hit = species[results[0]];
		removeFilter(filter, option);
		displaySpeciesPanel(hit);
	}
}

function removeFilter(selectedFilter, option) {
	filters.active[option[0]].tag.remove();
	delete filters.active[option[0]];
	
	let idx = selectedFilter.active.indexOf(option);
	selectedFilter.active.splice(idx, 1);
	
	let results = Object.keys(species);
	for (const pair of Object.values(filters.active))
		results = results.filter(pair.func);
	
	populateTable("speciesTable", results);
}