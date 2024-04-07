let speciesInput = document.getElementById('speciesFilterInput');
let inputDropdown = document.getElementById('speciesFilterInputDropdown');
let inputWrapper = document.getElementById('speciesFilterInputWrapper');
let selectFilterCategory = document.getElementById('speciesFilterCategory');
let categoryDropdown = document.getElementById('speciesFilterCategoryDropdown');
let categoryWrapper = document.getElementById('speciesFilterCategoryWrapper');
let selectedFilter = null;

function setupFilters() {

	buildFilter('Name', 1,
		Object.values(species),
		o => o.key,
		(x,o) => x.key == o.key
	);
	
	buildFilter('Type', 2, Object.values(types),
		o => o.name,
		(x,o) => x.type.find(y => y == o.ID) !== undefined
	);
	
	buildFilter('Move', 4, Object.values(moves),
		o => o.name,
		(x,o) => getFullLearnset(x).find(y => y == o.ID)
	);
	
	buildFilter('Ability', 3, Object.values(abilities),
		o => o.names[0], //make alternate names filterable eventually
		(x,o) => x.abilities.find(y => y[0] == o.ID)
	);
	
	//default filter category
	selectFilterCategory.value = 'Name';
	categoryDropdown.className = 'hide';
	
	for (const filter of Object.values(filters)) {
		let option = document.createElement('li');
		option.innerText = filter.label;
		option.addEventListener('mousedown', function() {
			selectFilterCategory.value = filter.label;
			selectedFilter = filter;
			speciesInput.value = '';
			selectFilterCategory.className = '';
			categoryDropdown.className = 'hide';
		});
		categoryDropdown.append(option);
	}
	selectFilterCategory.addEventListener('mousedown', function(event) {
		event.preventDefault();
		selectFilterCategory.className = 'highlight';
		categoryDropdown.className = '';
	});
	document.addEventListener('mousedown', function(event) {
		if (!selectFilterCategory.contains(event.target)) {
			selectFilterCategory.className = '';
			categoryDropdown.className = 'hide';
		}
	});
	
	//also default here for some reason?
	selectedFilter = filters['Name'];

	speciesInput.addEventListener('keyup', function(event) {
		event.preventDefault();
		if (event.key !== 'Enter')
			return;
		let input = speciesInput.value.trim().toLowerCase();
		let option = selectedFilter.options.find(x => selectedFilter.display(x).toLowerCase() === input);
		if (option) {
			addFilter(selectedFilter, option);
			speciesInput.value = '';
		}
	});
	speciesInput.addEventListener('keyup', buildDropdown);
	speciesInput.addEventListener('mousedown', buildDropdown);
	speciesInput.addEventListener('blur', function(event) {
		event.preventDefault();
		inputDropdown.innerHTML = '';
	});
}

function buildDropdown(event) {
	let input = speciesInput.value.trim().toLowerCase();
	let options = selectedFilter.options.filter(x => selectedFilter.display(x).toLowerCase().includes(input));
	inputDropdown.innerHTML = '';
	for (const option of options) {
		let wrapper = document.createElement('li');
		wrapper.innerText = selectedFilter.display(option);
		wrapper.addEventListener('mousedown', function() {
			addFilter(selectedFilter, option);
			speciesInput.value = '';
		});
		inputDropdown.append(wrapper);
	}
}

function buildFilter(label, max, options, display, filter) {
	filters[label] = {
		label: label,
		max: max,
		options: options,
		display: display,
		filter: filter,
		active: []
	};
}

//function filterName(option) {
//	let func = x => x === option[0];
//	addFilter(filters['Name'], option, func);
//}
//
//function filterRegion(option) {
//	let func = x => species[x].family.region === option[0];
//	addFilter(filters['Region'], option, func);
//}
//
//function filterType(option) {
//	let func = x => species[x].type.primary === option[0] || species[x].type.secondary === option[0];
//	addFilter(filters['Type'], option, func);
//}
//
//function filterMove(option) {
//	let filter = filters['Move'];
//	
//	if (option === 'RECALC') {
//		let activeFilters = [...filter.active];
//		for (const activeFilter of activeFilters)
//			filterMove(activeFilter);
//		return;
//	}
//
//	let func = function(x) {
//		let learnset = species[x].learnset;
//		let found = false;
//		for (const key in learnset) {
//			if (key === 'levelup' || key === 'prevo')
//				found = learnset.levelup.find(y => y[0] === option[0]);
//			else
//				found = learnset[key].find(y => y === option[0]);
//			if (found)
//				return true;
//		}
//		return false;
//	}
//	
//	let toggles = filters['Toggle'].toggles;
//	if (toggles.LEVELUP)
//		func = x => species[x].learnset.levelup.find(y => y[0] === option[0]) || (species[x].learnset.prevo && species[x].learnset.prevo.find(y => y[0] === option[0]));
//
//	addFilter(filter, option, func);
//}
//
//function filterMoveType(option) {
//	let filter = filters['Move Type'];
//	
//	if (option === 'RECALC') {
//		let activeFilters = [...filter.active];
//		for (const activeFilter of activeFilters)
//			filterMoveType(activeFilter);
//		return;
//	}
//	
//	let func = function(x) {
//		let learnset = species[x].learnset;
//		let found = false;
//		for (const key in learnset) {
//			if (key === 'levelup' || key === 'prevo')
//				found = learnset.levelup.find(y => moves[y[0]].type === option[0] && moves[y[0]].power > 0);
//			else
//				found = learnset[key].find(y => moves[y].type === option[0] && moves[y].power > 0);
//			if (found)
//				return true;
//		}
//		return false;
//	}
//	
//	let toggles = filters['Toggle'].toggles;
//	if (toggles.LEVELUP)
//		func = x => species[x].learnset.levelup.find(y => moves[y[0]].type === option[0]) || species[x].learnset.prevo.find(y => moves[y[0]].type === option[0]);
//	
//	addFilter(filter, option, func);
//}
//
//function filterAbilities(option) {
//	let func = x => species[x].abilities.primary === option[0] || species[x].abilities.secondary === option[0] || species[x].abilities.hidden === option[0];
//	addFilter(filters['Ability'], option, func);
//}
//
//function filterEggGroup(option) {
//	let func = x => species[x].family.eggGroup.primary === option[0] || species[x].family.eggGroup.secondary === option[0];
//	addFilter(filters['Egg Group'], option, func);
//}
//
//function filterHeldItem(option) {
//	let func = x => species[x].items != null && (species[x].items.common === option[0] || species[x].items.rare === option[0]);
//	addFilter(filters['Held Item'], option, func);
//}
//
//function filterLevelCap(option) {
//	let filter = filters['Level Cap'];
//
//	if (option === 'RECALC') {
//		let activeFilters = [...filter.active];
//		for (const activeFilter of activeFilters)
//			filterLevelCap(activeFilter);
//		return;
//	}
//
//	let toggles = filters['Toggle'].toggles;
//	
//	let difficulty = 'normal';
//	if (toggles.HARDCORE)
//		difficulty = 'hardcore';
//
//	if (toggles.ONLYNEW)
//		func = x => species[x].cap[difficulty] == option[0];
//	else
//		func = x => species[x].cap[difficulty] <= option[0];
//
//	if (toggles.EVOLVED)
//		filters.active.EVOLVED.func = x => !('evolutions' in species[x].family) || !(species[x].family.evolutions.find(y => species[y[2]].cap[difficulty] <= option[0]));
//
//	addFilter(filter, option, func);
//	filters.active[option[0]].tag.onclick = function() {
//		if (toggles.EVOLVED)
//			filters.active.EVOLVED.func = x => !species[x].family.evolutions;
//		removeFilter(filter, option);
//	};
//}
//
//function filterToggle(option) {
//	let filter = filters['Toggle'];
//	let toggles = filter.toggles;
//
//	let func = x => true;
//	if (option[0] === 'CHANGED')
//		func = x => species[x].changelog != null;
//	else if (option[0] === 'EVOLVED' && filters['Level Cap'].active.length === 0)
//		func = x => !species[x].family.evolutions;
//	else if (option[0] === 'REGIONAL')
//		func = x => species[x].family.forms && species[species[x].family.forms[0]].family.region !== species[x].family.region;
//	else if (option[0] === 'MEGA')
//		func = x => species[x].family.form && species[x].family.form.includes('Mega');
//	else if (option[0] === 'EVIOLITE')
//		func = x => species[x].family.evolutions && species[x].family.evolutions.filter(x => !(x[0] === 'MEGA')).length > 0;
//
//	if (toggles[option[0]] === true) {
//		toggles[option[0]] = false;
//		removeFilter(filter, option);
//	}
//	else {
//		toggles[option[0]] = true;
//		addFilter(filter, option, func);
//		filters.active[option[0]].tag.onclick = function() {
//			toggles[option[0]] = false;
//			if (option[0] === 'EVOLVED' || option[0] === 'HARDCORE' || option[0] === 'ONLYNEW')
//				filterLevelCap('RECALC');
//			if (option[0] === 'LEVELUP') {
//				filterMove('RECALC');
//				filterMoveType('RECALC');
//			}
//			removeFilter(filter, option);
//		};
//	}
//
//	if (option[0] === 'EVOLVED' || option[0] === 'HARDCORE' || option[0] === 'ONLYNEW')
//		filterLevelCap('RECALC');
//	if (option[0] === 'LEVELUP') {
//		filterMove('RECALC');
//		filterMoveType('RECALC');
//	}
//}

function addFilter(filter, option) {

	let active = {
		option: filter.display(option),
		func: x => filter.filter(x,option)
	}

	if ((found = filter.active.find(x => x.option == active.option))) {
		if (found.func == active.func) {
			console.log(found, 'active filter already active (how did you manage this?)\n');
			return;
		}
		removeFilter(filter, found);
	}

	filter.active.push(active);
	
	if (filter.active.length > filter.max) {
		removeFilter(filter, filter.active[0]);
	}

	let activeFiltersDisplay = document.getElementById('activeFilters');
	active.button = document.createElement('div');
	active.button.textContent = `${filter.label}: ${active.option}`;
	active.button.className = 'activeFilter';
	active.button.onclick = function() {
		removeFilter(filter, active);
	};
	activeFiltersDisplay.append(active.button);

	let results = Object.values(species);
	for (const a of Object.values(filters).reduce((list, x) => list.concat(x.active), [])) {
		results = results.filter(a.func);
	}
	
	populateTable('speciesTable', results);

	if (results.length === 1) {//&& filter.name === 'Name') {
		removeFilter(filter, active);
		displaySpeciesPanel(results[0]);
	}
}

function removeFilter(filter, active) {
	active.button.remove();

	filter.active.splice(filter.active.findIndex(x => x.option == active.option), 1);

	let results = Object.values(species);
	for (const a of Object.values(filters).reduce((list, x) => list.concat(x.active), [])) {
		results = results.filter(a.func);
	}
	
	populateTable('speciesTable', results);
}