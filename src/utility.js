function getAbilityName(ability) {
	if (ability[0] === 0)
		return undefined;

	return (abilities[ability[0]].names[ability[1]]);
}

function getFullLearnset(mon) {
	let learnset = [];
	if (mon.levelupMoves)
		learnset.push(...mon.levelupMoves.map(x => x[0]));
	if (mon.tmMoves)
		learnset.push(...mon.tmMoves.map(x => tmMoves[x]));
	if (mon.tutorMoves)
		learnset.push(...mon.tutorMoves.map(x => tutorMoves[x]));
	if (mon.eggMoves)
		learnset.push(...mon.eggMoves);
	return learnset;
}

function getSprite(ID) {
	let sprite = sprites[ID];
	if (sprite === undefined)
		sprite = sprites[0];
	return sprite;
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