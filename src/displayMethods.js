function displaySpeciesRow(tracker, key) {
	let mon = tracker.library[key];
	let currentRow = document.createElement("tr");
	currentRow.className = "speciesRow";
	currentRow.onclick = function() {
		displaySpeciesPanel(mon);
	};
	tracker.body.appendChild(currentRow);
	
	buildBackgroundColor(currentRow, mon);
	
	currentRow.append(
		buildWrapper("td", "speciesDexIDWrapper", mon.dexID),
		buildWrapperSprite("td", "speciesSprite", sprites[mon.key]),
		buildWrapperName("td", "speciesName", mon),
		buildWrapperTypes("td", "speciesTypes", types[mon.type.primary], types[mon.type.secondary]),
		buildWrapperAbilities("td", "speciesAbilities", mon.abilities),
	);
	for (const key in stats)
		currentRow.append(buildWrapperStat("td", "speciesStat", stats[key], mon.stats[key]));
}

function displayLevelUpMovesRow(tracker, movePair) {
	let [key, level] = movePair;
	let move = tracker.library[key];
	let currentRow = document.createElement("tr");
	currentRow.className = "movesRow";
	tracker.body.appendChild(currentRow);
	
	currentRow.append(
		buildWrapper("td", "moveLevelWrapper", level),
		buildWrapper("td", "moveNameWrapper", move.name),
		buildWrapperTypes("td", "moveType", types[move.type]),
		buildWrapperTypes("td", "moveSplit", splits[move.split]),
		buildWrapper("td", "movePowerWrapper", move.power),
		buildWrapper("td", "moveAccuracyWrapper", move.accuracy)
	);
}

function displayMovesRow(tracker, key) {
	let move = tracker.library[key];
	let currentRow = document.createElement("tr");
	currentRow.className = "movesRow";
	tracker.body.appendChild(currentRow);
	
	currentRow.append(
		buildWrapper("td", "moveNameWrapper", move.name),
		buildWrapperTypes("td", "moveType", types[move.type]),
		buildWrapperTypes("td", "moveSplit", splits[move.split]),
		buildWrapper("td", "movePowerWrapper", move.power),
		buildWrapper("td", "moveAccuracyWrapper", move.accuracy)
	);
}

function displaySpeciesPanel(mon) {
	let infoDisplay = document.getElementById("speciesPanelInfoDisplay");
	let tables = [
		["speciesLearnsetPrevoExclusiveTable", mon.learnset.prevo],
		["speciesLearnsetLevelUpTable", mon.learnset.levelup],
		["speciesLearnsetTMHMTable", mon.learnset.TM],
		["speciesLearnsetTutorTable", mon.learnset.tutor],
		["speciesLearnsetEggMovesTable", mon.learnset.egg],
		["speciesLearnsetEventTable", mon.learnset.event],
	]
	
	infoDisplay.innerText = "";
	
	infoDisplay.append(
		buildWrapperSprite("div", "infoSprite", sprites[mon.key]),
		buildWrapperName("div", "infoName", mon),
		buildWrapper("div", "infoDexIDWrapper",  "#" + mon.dexID),
		buildWrapperTypes("div", "infoTypes", types[mon.type.primary], types[mon.type.secondary]),
		buildWrapperAbilitiesFull("div", "infoAbilities", mon.abilities)
	);
	
	let statWrapper = buildWrapper("div", "infoStats");
	for (let i = 0; i < Object.keys(stats).length - 1; i++) {
		let stat = Object.keys(stats)[i];
		statWrapper.append(buildWrapperStatFull("div", "infoStat", stats[stat], mon.stats[stat]));
	}
	statWrapper.append(buildWrapperStat("div", "infoStat", "BST", mon.stats.total));
	
	infoDisplay.append(
		statWrapper,
		buildWrapperChangelog("div", "infoChangelog", mon),
		buildWrapperFamilyTree("div", "infoFamilyTree", mon),
		buildWrapperCoverageDefensive("div", "infoCoverage", types[mon.type.primary], types[mon.type.secondary]),
		buildWrapperCap("div", "infoCap", mon.cap),
		buildWrapperHeldItems("div", "infoItems", mon.items),
		buildWrapperEggGroups("div", "infoEggGroups", mon.family.eggGroup),
	);

	for (const [ID, data] of tables) {
		let table = document.getElementById(ID);
		table.className = "tableWrapper";
		if (data && data.length > 0)
			populateTable(ID, data);
		else
			table.classList.toggle("hide");
	}

	$('#speciesModal').modal('show');
}

function buildWrapper(tag, className, text=null) {
	let wrapper = document.createElement(tag);
	wrapper.className = className;
	if (text)
		wrapper.textContent = text;
	if (text === 0)
		wrapper.textContent = "-";
	
	return wrapper;
}

function buildWrapperSprite(tag, className, src) {
	let wrapper = buildWrapper(tag, className + "Wrapper");
	
	let img = document.createElement("img");
	img.className = className;
	img.src = src;
	wrapper.append(img);
	
	return wrapper;
}

function buildWrapperName(tag, className, mon) {
	let wrapper = buildWrapper(tag, className + "Wrapper");
	
	if (mon.family.variant)
		wrapper.append(buildWrapper("div", className + "Region", regions[mon.family.region].variant));
	
	wrapper.append(buildWrapper("div", className + "Name", mon.name));

	if (mon.family.form)
		wrapper.append(buildWrapper("div", className + "Form", mon.family.form));
	
	return wrapper;
}

function buildWrapperTypes(tag, className, primary, secondary=null) {
	let wrapper = buildWrapper(tag, className + "Wrapper");
	
	let typeBlock = buildWrapper("div", "typeWrapper", primary.name);
	typeBlock.style.backgroundColor = primary.color;
	wrapper.append(typeBlock);
	
	if (secondary) {
		typeBlock = buildWrapper("div", "typeWrapper", secondary.name);
		typeBlock.style.backgroundColor = secondary.color;
		wrapper.append(typeBlock);
	}
	
	return wrapper;
}

function buildWrapperAbilities(tag, className, a) {
	let wrapper = buildWrapper(tag, className + "Wrapper");
	
	if (a.primary)
		wrapper.append(buildWrapper("div", className + "Primary", abilities[a.primary].name));
	
	if (a.secondary)
		wrapper.append(buildWrapper("div", className + "Secondary", abilities[a.secondary].name));
	
	if (a.hidden)
		wrapper.append(buildWrapper("div", className + "Hidden", abilities[a.hidden].name));
	
	return wrapper;
}

function buildWrapperAbilitiesFull(tag, className, a) {
	let wrapper = buildWrapper(tag, className + "Wrapper");
	
	if (a.primary)
		wrapper.append(buildWrapper("div", className + "Primary", abilities[a.primary].name + " - " + abilities[a.primary].description));
	
	if (a.secondary)
		wrapper.append(buildWrapper("div", className + "Secondary", abilities[a.secondary].name + " - " + abilities[a.secondary].description));
	
	if (a.hidden)
		wrapper.append(buildWrapper("div", className + "Hidden", abilities[a.hidden].name + " - " + abilities[a.hidden].description));
	
	return wrapper;
}

function buildWrapperStat(tag, className, label, value) {
	let wrapper = buildWrapper(tag, className + "Wrapper");
	
	wrapper.append(buildWrapper("div", className + "Label", label));
	wrapper.append(buildWrapper("div", className + "Value", value));
	
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
	
	let bar = buildWrapper("div", "infoStatBar rank" + rank);
	bar.style.width = `${(value / 255) * 300}px`;
	wrapper.append(bar);
	
	return wrapper;
}

function buildWrapperChangelog(tag, className, mon) {
	let wrapper = buildWrapper(tag, className + "Wrapper");
	
	if (!mon.changelog)
		return wrapper;
	
	wrapper.append(buildWrapper("div", "infoChangelogLabel", "RR Changes"));
	
	if (mon.changelog.unique)
		wrapper.append(buildWrapper("div", "infoChangelogUnique", "All New Pokemon!"));
	
	if (mon.changelog.type) {
		let typeWrapper = buildWrapper("div", "infoChangelogTypesWrapper");
		typeWrapper.append(buildWrapperTypes("div", "infoChangelogOldType", types[mon.changelog.type.primary], types[mon.changelog.type.secondary]));
		typeWrapper.append(buildWrapper("div", className + "ArrowWrapper", "→"));
		typeWrapper.append(buildWrapperTypes("div", "infoChangelogNewType", types[mon.type.primary], types[mon.type.secondary]));
		wrapper.append(typeWrapper);
	}
	
	if (mon.changelog.abilities) {
		let abilityWrapper = buildWrapper("div", "infoChangelogAbilityWrapper");
		for (const ability of ["primary", "secondary", "hidden"]) {
			let oldAbility = mon.changelog.abilities[ability];
			let newAbility = abilities[mon.abilities[ability]];
			if (!oldAbility)
				continue;
			if (oldAbility && newAbility)
				abilityWrapper.append(buildWrapper("div", "infoChangelogAbility " + ability, oldAbility + " → " + newAbility.name));
			else if (newAbility)
				abilityWrapper.append(buildWrapper("div", "infoChangelogAbility " + ability, "None → " + newAbility.name));
			else
				abilityWrapper.append(buildWrapper("div", "infoChangelogAbility " + ability, oldAbility + " → None"));
			}
		wrapper.append(abilityWrapper);
	}
	
	if (mon.changelog.stats) {
		let statsWrapper = buildWrapper("div", className);
		
		for (const stat in mon.changelog.stats) {
			let statClass =  mon.changelog.stats[stat] < mon.stats[stat] ? "infoChangelogBuff" : "infoChangelogNerf";
			statsWrapper.append(buildWrapper("div", statClass, stats[stat] + " " + mon.changelog.stats[stat] + " → " + mon.stats[stat]));
		}
		wrapper.append(statsWrapper);
	}
	
	return wrapper;
}

function buildWrapperFamilyTree(tag, className, mon) {
	let wrapper = buildWrapper(tag, className + "Wrapper");
	wrapper.append(buildWrapper("div", "infoTreeEvoLabel", "Evolution Line"));
	let display = buildWrapper("div", "infoEvolutionMethods");
	wrapper.append(familyTree(display, mon.family.ancestor));
	wrapper.append(display);
	
	
	if (mon.family.forms) {
		wrapper.append(buildWrapper("div", "infoTreeFormsLabel", "Alternate Forms"));
		let formsWrapper = buildWrapper("div", "infoFormsWrapper");
		for (const key of mon.family.forms) {
			let spriteWrapper = buildWrapper("div", "infoTreeSpriteWrapper");
			let img = document.createElement("img");
			img.src = sprites[key];
			img.className = "infoTreeSprite";
			img.onclick = function () {
				displaySpeciesPanel(species[key]);
			}
			spriteWrapper.append(img);
			formsWrapper.append(spriteWrapper);
		}
		wrapper.append(formsWrapper);
	}

	return wrapper;
}

function familyTree(display, key, prevo=null, evo=null) {
	let wrapper = buildWrapper("div", "infoTreeWrapper " + key);
	
	if (prevo) {
		wrapper.className += " inner";
		let evoWrapper = buildWrapper("div", "evoMethodWrapper");
		let arrow = buildWrapper("div", "infoTreeArrow", `→`);
		
		let leftMon = fullSpeciesName(prevo);
		let rightMon = fullSpeciesName(key);
		let description = eval(evolutions[evo[0]]);
		arrow.title = description;
		let method = buildWrapper("div", "evoMethod");
		
		method.innerHTML = `<span>${leftMon}</span> → <span>${rightMon}</span> ${description}.`;
		display.append(method);
		
		evoWrapper.append(arrow);
		wrapper.append(evoWrapper);
	}
	else
		wrapper.className += " outer";
	
	let spriteWrapper = buildWrapper("div", "infoTreeSpriteWrapper");
	let img = document.createElement("img");
	img.src = sprites[key];
	img.className = "infoTreeSprite";
	img.onclick = function () {
		displaySpeciesPanel(species[key]);
	}
	spriteWrapper.append(img);
	wrapper.append(spriteWrapper);	
	if (species[key].family.evolutions) {
		if (species[key].family.evolutions.length === 1)
			wrapper.className += " single";
		let branchWrapper = buildWrapper("div", "infoTreeBranchWrapper");
		for (const evolution of species[key].family.evolutions)
			branchWrapper.append(familyTree(display, evolution[2], key, evolution));
		wrapper.append(branchWrapper);
	}
	
	return wrapper;
}

function buildWrapperCoverageDefensive(tag, className, primary, secondary=null) {
	let wrapper = buildWrapper(tag, className + "Wrapper");
	
	let label = buildWrapper("div", "coverageLabelWrapper", "Weakness");
	let matchups = buildWrapper("div", "coverageMatchupsWrapper");
	
	let coverage = {};
	for (const key in primary.defensive) {
		let matchup = primary.defensive[key];
		if (secondary)
			matchup *= secondary.defensive[key];
		matchups.append(buildWrapperTypeMatchup(key, matchup));
	}
	
	wrapper.append(label, matchups);
	
	return wrapper;
}

function buildWrapperTypeMatchup(key, matchup) {
	let wrapper = buildWrapper("div", "typeMatchupWrapper");
	
	wrapper.append(buildWrapperTypes("div", "typeMatchupLabel", types[key]));
	wrapper.append(buildWrapper("div", "typeMatchupMultiplier x" + (matchup * 100), "*" + matchup));
	
	return wrapper;
}

function buildWrapperCap(tag, className, cap) {
	let wrapper = buildWrapper(tag, className + "Wrapper");
	
	wrapper.append(buildWrapper("div", "infoCapLabel", "Availability"));
	if (cap.locations) {
		for (const [key, method] of cap.locations) {
			wrapper.append(buildWrapper("div", className, locations[key].name + " " + locations[key][method].name));
		}
	}
	else {
		wrapper.append(buildWrapper("div", className, "Unobtainable in the wild."));
	}
	
	wrapper.append(buildWrapper("div", "infoCapLabel", "Level Cap"));
	
	if ("normal" in cap) {
		wrapper.append(buildWrapper("div", className, "Available on Normal " + caps[cap.normal].name + "."));
	}
	else {
		wrapper.append(buildWrapper("div", className, "Unobtainable on Normal Difficulty."));
	}
	
	if ("hardcore" in cap) {
		wrapper.append(buildWrapper("div", className, "Available on Hardcore " + caps[cap.hardcore].name + "."));
	}
	else {
		wrapper.append(buildWrapper("div", className, "Unobtainable on Hardcore Difficulty."));
	}
	
	return wrapper;
}

function buildWrapperHeldItems(tag, className, i) {
	let wrapper = buildWrapper(tag, className + "Wrapper");
	
	if (!i)
		return wrapper;
	
	wrapper.append(buildWrapper("div", "infoItemsLabel", "Held Items"));
	if (i.common)
		wrapper.append(buildWrapper("div", className, "Common: " + heldItems[i.common].name));
	if (i.rare)
		wrapper.append(buildWrapper("div", className, "Rare: " + heldItems[i.rare].name));
	
	return wrapper;
}

function buildWrapperEggGroups(tag, className, e) {
	let wrapper = buildWrapper(tag, className + "Wrapper");
	
	if (!e)
		return wrapper;
	
	wrapper.append(buildWrapper("div", "infoEggGroupsLabel", "Egg Groups"));
	if (e.primary)
		wrapper.append(buildWrapper("div", className, eggGroups[e.primary].name));
	if (e.secondary)
		wrapper.append(buildWrapper("div", className, eggGroups[e.secondary].name));
	
	return wrapper;
}

function buildBackgroundColor(currentRow, mon) {
	currentRow.style.backgroundColor = types[mon.type.primary].color;
		currentRow.style.backgroundImage = "linear-gradient(to right, rgba" + currentRow.style.backgroundColor.substr(3).replace(")", ", 0.4)") + ", rgb(63, 40, 40, 0.4))";
		currentRow.style.backgroundColor = "";
	return;
	
	//if (mon.type.secondary) {
	//	let gradient = [];
	//	currentRow.style.backgroundColor = types[mon.type.primary].color;
	//	gradient.push(currentRow.style.backgroundColor.substr(3).replace(")", ", 0.4)"));
	//	currentRow.style.backgroundColor = types[mon.type.secondary].color;
	//	gradient.push(currentRow.style.backgroundColor.substr(3).replace(")", ", 0.4)"));
	//	currentRow.style.backgroundColor = "";
	//	currentRow.style.backgroundImage = "linear-gradient(to right, rgba" + gradient[0] + ", rgba" + gradient[1] + ")";
	//}
	//else {
	//	currentRow.style.backgroundColor = types[mon.type.primary].color;
	//	currentRow.style.backgroundImage = "linear-gradient(to right, rgba" + currentRow.style.backgroundColor.substr(3).replace(")", ", 0.4)") + ", rgb(63, 40, 40, 0.4))";
	//	currentRow.style.backgroundColor = "";
	//}
}