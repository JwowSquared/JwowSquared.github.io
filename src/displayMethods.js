function displayHelp() {
	$('#helpModal').modal('show');
}

function displaySpeciesRow(tracker, mon) {
	let currentRow = document.createElement('tr');
	currentRow.className = 'speciesRow';
	currentRow.onclick = function() {
		displaySpeciesPanel(mon);
	};
	tracker.body.appendChild(currentRow);
	
	buildBackgroundColor(currentRow, mon);
	
	currentRow.append(
		buildWrapper('td', 'speciesDexIDWrapper', mon.dexID),
		buildWrapperSprite('td', 'speciesSprite', getSprite(mon.ID)),
		buildWrapper('td', 'speciesNameWrapper', mon.key),
		buildWrapperTypes('td', 'speciesTypes', types[mon.type[0]], types[mon.type[1]]),
		buildWrapperAbilities('td', 'speciesAbilities', mon.abilities),
		buildWrapperStat('td', 'speciesStat', 'HP', mon.stats[0]),
		buildWrapperStat('td', 'speciesStat', 'Atk', mon.stats[1]),
		buildWrapperStat('td', 'speciesStat', 'Def', mon.stats[2]),
		buildWrapperStat('td', 'speciesStat', 'SpA', mon.stats[4]),
		buildWrapperStat('td', 'speciesStat', 'SpD', mon.stats[5]),
		buildWrapperStat('td', 'speciesStat', 'Spe', mon.stats[3]),
		buildWrapperStat('td', 'speciesStat', 'BST', mon.stats.reduce((total, y) => total += y, 0))
	);
}

function displayLevelUpMovesRow(tracker, movePair) {
	let [move, level] = movePair;
	let currentRow = document.createElement('tr');
	currentRow.className = 'movesRow';
	tracker.body.appendChild(currentRow);
	
	currentRow.append(
		buildWrapper('td', 'moveLevelWrapper', level),
		buildWrapper('td', 'moveNameWrapper', move.name),
		buildWrapperTypes('td', 'moveType', types[move.type]),
		buildWrapperSprite('td', 'moveSplit', getSprite(splits[move.split])),
		buildWrapper('td', 'movePowerWrapper', move.power),
		buildWrapper('td', 'moveAccuracyWrapper', move.accuracy),
		buildWrapper('td', 'moveDescriptionWrapper', move.description)
	);
}

function displayMovesRow(tracker, move) {
	let currentRow = document.createElement('tr');
	currentRow.className = 'movesRow';
	tracker.body.appendChild(currentRow);
	
	currentRow.append(
		buildWrapper('td', 'moveNameWrapper', move.name),
		buildWrapperTypes('td', 'moveType', types[move.type]),
		buildWrapperSprite('td', 'moveSplit', getSprite(splits[move.split])),
		buildWrapper('td', 'movePowerWrapper', move.power),
		buildWrapper('td', 'moveAccuracyWrapper', move.accuracy),
		buildWrapper('td', 'moveDescriptionWrapper', move.description)
	);
}

function displaySpeciesPanel(mon) {
	let infoDisplay = document.getElementById('speciesPanelInfoDisplay');
	let tables = [
		['speciesLearnsetPrevoExclusiveTable', mon.prevoMoves?.map(x => moves[x])],
		['speciesLearnsetLevelUpTable', mon.levelupMoves?.map(x => [moves[x[0]], x[1]])],
		['speciesLearnsetTMHMTable', mon.tmMoves?.map(x => moves[tmMoves[x]]).filter(x => x !== undefined)],
		['speciesLearnsetTutorTable', mon.tutorMoves?.map(x => moves[tutorMoves[x]]).filter(x => x !== undefined)],
		['speciesLearnsetEggMovesTable', mon.eggMoves?.map(x => moves[x])],
		['speciesLearnsetEventTable', mon.eventMoves?.map(x => moves[x])],
	]
	
	infoDisplay.innerText = '';
	
	infoDisplay.append(
		buildWrapperSprite('div', 'infoSprite', getSprite(mon.ID)),
		buildWrapper('div', 'infoNameName', mon.key),
		buildWrapper('div', 'infoDexIDWrapper',  '#' + mon.dexID),
		buildWrapperTypes('div', 'infoTypes', types[mon.type[0]], types[mon.type[1]]),
		buildWrapperAbilitiesFull('div', 'infoAbilities', mon.abilities)
	);
	
	let statWrapper = buildWrapper('div', 'infoStats');
	statWrapper.append(
		buildWrapperStatFull('div', 'infoStat', 'HP', mon.stats[0]),
		buildWrapperStatFull('div', 'infoStat', 'Atk', mon.stats[1]),
		buildWrapperStatFull('div', 'infoStat', 'Def', mon.stats[2]),
		buildWrapperStatFull('div', 'infoStat', 'SpA', mon.stats[4]),
		buildWrapperStatFull('div', 'infoStat', 'SpD', mon.stats[5]),
		buildWrapperStatFull('div', 'infoStat', 'Spe', mon.stats[3]),
		buildWrapperStat('div', 'infoStat', 'BST', mon.stats.reduce((total, y) => total += y, 0))
	);
	
	infoDisplay.append(
		statWrapper,
		buildWrapperChangelog('div', 'infoChangelog', mon),
		buildWrapperFamilyTree('div', 'infoFamilyTree', mon),
		buildWrapperCoverageDefensive('div', 'infoCoverage', mon.type[0], mon.type[1]),
		//buildWrapperCap('div', 'infoCap', mon.ID),
		buildWrapperHeldItems('div', 'infoItems', mon.items),
		//buildWrapperEggGroups('div', 'infoEggGroups', mon.eggGroup),
	);

	for (const [ID, data] of tables) {
		let table = document.getElementById(ID);
		table.className = 'tableWrapper';
		if (data && data.length > 0)
			populateTable(ID, data);
		else
			table.classList.toggle('hide');
	}

	$('#speciesModal').modal('show');
}

function buildWrapper(tag, className, text=null) {
	let wrapper = document.createElement(tag);
	wrapper.className = className;
	if (text)
		wrapper.textContent = text;
	if (text === 0)
		wrapper.textContent = '-';
	
	return wrapper;
}

function buildWrapperSprite(tag, className, src) {
	let wrapper = buildWrapper(tag, className + 'Wrapper');
	
	let img = document.createElement('img');
	img.className = className;
	img.src = src;
	wrapper.append(img);
	
	return wrapper;
}

//function buildWrapperName(tag, className, mon) {
//	let wrapper = buildWrapper(tag, className + 'Wrapper');
//	
//	if (mon.family.variant)
//		wrapper.append(buildWrapper('div', className + 'Region', regions[mon.family.region].variant));
//	
//	wrapper.append(buildWrapper('div', className + 'Name', mon.name));
//
//	if (mon.family.form)
//		wrapper.append(buildWrapper('div', className + 'Form', mon.family.form));
//	
//	return wrapper;
//}

function buildWrapperTypes(tag, className, primary, secondary=null) {
	let wrapper = buildWrapper(tag, className + 'Wrapper');
	
	let typeBlock = buildWrapper('div', 'typeWrapper', primary.name);
	typeBlock.style.backgroundColor = primary.color;
	wrapper.append(typeBlock);
	
	if (secondary) {
		typeBlock = buildWrapper('div', 'typeWrapper', secondary.name);
		typeBlock.style.backgroundColor = secondary.color;
		wrapper.append(typeBlock);
	}
	
	return wrapper;
}

function buildWrapperAbilities(tag, className, a) {
	let wrapper = buildWrapper(tag, className + 'Wrapper');
	
	if ((name = getAbilityName(a[1])))
		wrapper.append(buildWrapper('div', className + 'Primary', name));
	
	if ((name = getAbilityName(a[2])))
		wrapper.append(buildWrapper('div', className + 'Secondary', name));
	
	if ((name = getAbilityName(a[0])))
		wrapper.append(buildWrapper('div', className + 'Hidden', name));
	
	return wrapper;
}

function buildWrapperAbilitiesFull(tag, className, a) {
	let wrapper = buildWrapper(tag, className + 'Wrapper');
	
	if ((name = getAbilityName(a[1])))
		wrapper.append(buildWrapper('div', className + 'Primary', name + ' - ' + abilities[a[1][0]].description));
	
	if ((name = getAbilityName(a[2])))
		wrapper.append(buildWrapper('div', className + 'Secondary', name + ' - ' + abilities[a[2][0]].description));
	
	if ((name = getAbilityName(a[0])))
		wrapper.append(buildWrapper('div', className + 'Hidden', name + ' - ' + abilities[a[0][0]].description));
	
	return wrapper;
}

function buildWrapperStat(tag, className, label, value) {
	let wrapper = buildWrapper(tag, className + 'Wrapper');
	
	wrapper.append(buildWrapper('div', className + 'Label', label));
	wrapper.append(buildWrapper('div', className + 'Value', value));
	
	return wrapper;
}

function buildWrapperStatFull(tag, className, label, value) {
	let wrapper = buildWrapperStat(tag, className, label, value);
	
	let rank = 6;
	if (value < 150)
		rank = 5;
	if (value < 120)
		rank = 4;
	if (value < 90)
		rank = 3;
	if (value < 60)
		rank = 2;
	if (value < 30)
		rank = 1;
	
	let bar = buildWrapper('div', 'infoStatBar rank' + rank);
	bar.style.width = `${(value / 255) * 300}px`;
	wrapper.append(bar);
	
	return wrapper;
}

function buildWrapperChangelog(tag, className, mon) {
	let wrapper = buildWrapper(tag, className + 'Wrapper');
	
	if (!mon.changes)
		return wrapper;
	
	wrapper.append(buildWrapper('div', 'infoChangelogLabel', 'RR Changes'));
	
	if (mon.changes == 'new') {
		wrapper.append(buildWrapper('div', 'infoChangelogUnique', 'All New Pokemon!'));
		return wrapper;
	}
	
	if (mon.changes.type) {
		let typeWrapper = buildWrapper('div', 'infoChangelogTypesWrapper');
		typeWrapper.append(buildWrapperTypes('div', 'infoChangelogOldType', types[mon.changes.type[0]], types[mon.changes.type[1]]));
		typeWrapper.append(buildWrapper('div', className + 'ArrowWrapper', '→'));
		typeWrapper.append(buildWrapperTypes('div', 'infoChangelogNewType', types[mon.type[0]], types[mon.type[1]]));
		wrapper.append(typeWrapper);
	}
	
	if (mon.changes.abilities) {
		let abilityWrapper = buildWrapper('div', 'infoChangelogAbilityWrapper');
		for (const ability of [1, 2, 0]) {
			let oldAbility = mon.changes.abilities[ability];
			let newAbility = mon.abilities[ability];

			if (newAbility.equals(oldAbility))
				continue;
			if (typeof oldAbility !== 'string')
				oldAbility = getAbilityName(oldAbility);
			newAbility = getAbilityName(newAbility);
		
			if (oldAbility && newAbility)
				abilityWrapper.append(buildWrapper('div', 'infoChangelogAbility' + ability, oldAbility + ' → ' + newAbility));
			else if (newAbility)
				abilityWrapper.append(buildWrapper('div', 'infoChangelogAbility' + ability, 'None → ' + newAbility));
			else
				abilityWrapper.append(buildWrapper('div', 'infoChangelogAbility' + ability, oldAbility + ' → None'));
			}
		wrapper.append(abilityWrapper);
	}
	
	if (mon.changes.stats) {
		let statsWrapper = buildWrapper('div', className);
		
		for (const [idx, label] of Object.entries({HP:0, Atk:1, Def:2, SpA:4, SpD:5, Spe:3})) {
			if (mon.changes.stats[idx] === mon.stats[idx])
				continue;
			let statClass = mon.changes.stats[idx] < mon.stats[idx] ? 'infoChangelogBuff' : 'infoChangelogNerf';
			statsWrapper.append(buildWrapper('div', statClass, label + ' ' + mon.changes.stats[idx] + ' → ' + mon.stats[idx]));
		}
		wrapper.append(statsWrapper);
	}
	
	return wrapper;
}

function buildWrapperFamilyTree(tag, className, mon) {
	let wrapper = buildWrapper(tag, className + 'Wrapper');
	wrapper.append(buildWrapper('div', 'infoTreeEvoLabel', 'Evolution Line'));
	let display = buildWrapper('div', 'infoEvolutionMethods');
	wrapper.append(familyTree(display, species[mon.ancestor]));
	wrapper.append(display);
	
	
	if (mon.order !== undefined) {
		let forms = Object.values(species).filter(x => x.dexID == mon.dexID).sort(cmp(x => x.order));
		wrapper.append(buildWrapper('div', 'infoTreeFormsLabel', 'Alternate Forms'));
		let formsWrapper = buildWrapper('div', 'infoFormsWrapper');
		for (const form of forms) {
			let spriteWrapper = buildWrapper('div', 'infoTreeSpriteWrapper');
			let img = document.createElement('img');
			img.src = getSprite(form.ID);
			img.className = 'infoTreeSprite';
			img.onclick = function () {
				displaySpeciesPanel(form);
			}
			spriteWrapper.append(img);
			formsWrapper.append(spriteWrapper);
		}
		wrapper.append(formsWrapper);
	}

	return wrapper;
}

function familyTree(display, mon, prevo=null, evo=null) {
	let wrapper = buildWrapper('div', 'infoTreeWrapper ' + mon.key);
	
	if (prevo) {
		wrapper.className += ' inner';
		let evoWrapper = buildWrapper('div', 'evoMethodWrapper');
		let arrow = buildWrapper('div', 'infoTreeArrow', `→`);
		
		let leftMon = prevo.key;
		let rightMon = mon.key;
		let description = eval(evolutions[evo[0]]);
		arrow.title = description;
		let method = buildWrapper('div', 'evoMethod');
		
		method.innerHTML = `<span>${leftMon}</span> → <span>${rightMon}</span> ${description}.`;
		display.append(method);
		
		evoWrapper.append(arrow);
		wrapper.append(evoWrapper);
	}
	else
		wrapper.className += ' outer';
	
	let spriteWrapper = buildWrapper('div', 'infoTreeSpriteWrapper');
	let img = document.createElement('img');
	img.src = getSprite(mon.ID);
	img.className = 'infoTreeSprite';
	img.onclick = function () {
		displaySpeciesPanel(mon);
	}
	spriteWrapper.append(img);
	wrapper.append(spriteWrapper);	
	if (mon.evolutions) {
		if (mon.evolutions.length === 1)
			wrapper.className += ' single';
		let branchWrapper = buildWrapper('div', 'infoTreeBranchWrapper');
		for (const evolution of mon.evolutions)
			branchWrapper.append(familyTree(display, species[evolution[2]], mon, evolution));
		wrapper.append(branchWrapper);
	}
	
	return wrapper;
}

function buildWrapperCoverageDefensive(tag, className, primary, secondary=undefined) {
	let wrapper = buildWrapper(tag, className + 'Wrapper');
	
	let label = buildWrapper('div', 'coverageLabelWrapper', 'Weakness');
	let matchups = buildWrapper('div', 'coverageMatchupsWrapper');
	
	let coverage = {};
	for (const type of Object.values(types)) {

		let matchup = 1;
		for (const speciesType of [primary, secondary]) {

			if (speciesType === undefined)
				continue;
			
			switch (type.matchup[speciesType]) {
				case 20: matchup *= 2;   break;
				case  5: matchup *= 0.5; break;
				case  1: matchup *= 0;   break;
			}
		}
		
		matchups.append(buildWrapperTypeMatchup(type, matchup));
	}
	
	wrapper.append(label, matchups);
	
	return wrapper;
}

function buildWrapperTypeMatchup(type, matchup) {
	let wrapper = buildWrapper('div', 'typeMatchupWrapper');
	
	wrapper.append(buildWrapperTypes('div', 'typeMatchupLabel', type));
	wrapper.append(buildWrapper('div', 'typeMatchupMultiplier x' + (matchup * 100), matchup + 'x'));
	
	return wrapper;
}

function buildWrapperCap(tag, className, ID) {
	let wrapper = buildWrapper(tag, className + 'Wrapper');
	
	let myAreas = Object.values(areas).reduce((listx, x) => listx.concat(x.areas), []).filter(x => Object.values(x).reduce((listy, y) => list.concat(Object.entries(y).filter(z => z[0].includes('wild') || z[0].includes('fixed')).map(z => z[1]).reduce((listz, z) => listz.concat(Object.values(z)), [])), []));
	
	wrapper.append(buildWrapper('div', 'infoCapLabel', 'Availability'));
	if (myAreas.length > 0) {
		for (const area of myAreas) {
			wrapper.append(buildWrapper('div', className, area.name));
		}
	}
	else {
		wrapper.append(buildWrapper('div', className, 'Unobtainable in the wild.'));
	}
	
	//wrapper.append(buildWrapper('div', 'infoCapLabel', 'Level Cap'));
	
	//if ('normal' in cap) {
	//	wrapper.append(buildWrapper('div', className, 'Available on Normal ' + caps[cap.normal].name + '.'));
	//}
	//else {
	//	wrapper.append(buildWrapper('div', className, 'Unobtainable on Normal Difficulty.'));
	//}
	//
	//if ('hardcore' in cap) {
	//	wrapper.append(buildWrapper('div', className, 'Available on Hardcore ' + caps[cap.hardcore].name + '.'));
	//}
	//else {
	//	wrapper.append(buildWrapper('div', className, 'Unobtainable on Hardcore Difficulty.'));
	//}
	
	return wrapper;
}

function buildWrapperHeldItems(tag, className, i) {
	let wrapper = buildWrapper(tag, className + 'Wrapper');
	
	if (i.equals([0, 0])) //why must it be this way?
		return wrapper;
	wrapper.append(buildWrapper('div', 'infoItemsLabel', 'Held Items'));
	if (i[0])
		wrapper.append(buildWrapper('div', className, 'Common: ' + items[i[0]].name));
	if (i[1])
		wrapper.append(buildWrapper('div', className, 'Rare: ' + items[i[1]].name));
	
	return wrapper;
}

function buildWrapperEggGroups(tag, className, e) {
	let wrapper = buildWrapper(tag, className + 'Wrapper');
	
	if (e.equals([0, 0]))
		return wrapper;
	
	wrapper.append(buildWrapper('div', 'infoEggGroupsLabel', 'Egg Groups'));
	if (e[0])
		wrapper.append(buildWrapper('div', className, 'egg1'));//eggGroups[e[0]].name));
	if (e[1])
		wrapper.append(buildWrapper('div', className, 'egg2'));//eggGroups[e[1]].name));
	
	return wrapper;
}

function buildBackgroundColor(currentRow, mon) {
	currentRow.style.backgroundColor = types[mon.type[0]].color;
		currentRow.style.backgroundImage = 'linear-gradient(to right, rgba' + currentRow.style.backgroundColor.substr(3).replace(')', ', 0.4)') + ', rgb(63, 40, 40, 0.4))';
		currentRow.style.backgroundColor = '';
	return;
	
	//if (mon.type.secondary) {
	//	let gradient = [];
	//	currentRow.style.backgroundColor = types[mon.type.primary].color;
	//	gradient.push(currentRow.style.backgroundColor.substr(3).replace(')', ', 0.4)'));
	//	currentRow.style.backgroundColor = types[mon.type.secondary].color;
	//	gradient.push(currentRow.style.backgroundColor.substr(3).replace(')', ', 0.4)'));
	//	currentRow.style.backgroundColor = '';
	//	currentRow.style.backgroundImage = 'linear-gradient(to right, rgba' + gradient[0] + ', rgba' + gradient[1] + ')';
	//}
	//else {
	//	currentRow.style.backgroundColor = types[mon.type.primary].color;
	//	currentRow.style.backgroundImage = 'linear-gradient(to right, rgba' + currentRow.style.backgroundColor.substr(3).replace(')', ', 0.4)') + ', rgb(63, 40, 40, 0.4))';
	//	currentRow.style.backgroundColor = '';
	//}
}