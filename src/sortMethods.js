function basicCompare (a, b) {
	return a == b ? 0 : a < b ? -1 : 1;
}

function sortSpeciesRow(tracker, properties) {
	let library = tracker.library;
	let compare = basicCompare;
	function tiebreaker (a, b) {
		let comp = basicCompare(library[a].dexID, library[b].dexID);
		if (comp !== 0)
			return comp;
		
		//if two mons have the same dexID, they must be forms of eachother
		comp = basicCompare(library[a].family.forms.indexOf(a), library[b].family.forms.indexOf(b));
		return comp;
	};
	if (properties.length === 1) {
		let property = properties[0];
		compare = function (a, b) {
			let comp = library[a][property] == library[b][property] ? 0 : library[a][property] < library[b][property] ? -1 : 1;
			return comp == 0 ? tiebreaker(a, b) : comp;
		};
	}
	else if (properties.length === 2) {
		let property = properties[0];
		let subproperty = properties[1];
		compare = function (a, b) {
			let comp = library[a][property][subproperty] == library[b][property][subproperty] ? 0 : library[a][property][subproperty] < library[b][property][subproperty] ? -1 : 1;
			return comp == 0 ? tiebreaker(a, b) : comp;
		};
	}
	
	tracker.data.sort(compare);
}

function sortLevelUpMovesRow(tracker, property) {
	let library = tracker.library;
	let compare = basicCompare;
	property = property[0];
	function tiebreaker (a, b) {
		let comp = basicCompare(a[1], b[1]);
		if (comp !== 0)
			return comp;
		
		comp = basicCompare(library[a[0]].name, library[b[0]].name);
		return comp;
	};
	if (property === "level") {
		compare = function (a, b) {
			let comp = basicCompare(a[1], b[1]);
			return comp == 0 ? tiebreaker(a, b) : comp;
		};
	}
	else {
		compare = function (a, b) {
			let comp = library[a[0]][property] == library[b[0]][property] ? 0 : library[a[0]][property] < library[b[0]][property] ? -1 : 1;
			return comp == 0 ? tiebreaker(a, b) : comp;
		};
	}
	tracker.data.sort(compare);
}

function sortMovesRow(tracker, property) {
	let library = tracker.library;
	let compare = basicCompare;
	property = property[0];
	function tiebreaker (a, b) {
		let comp = basicCompare(library[a].name, library[b].name);
		return comp;
	};
	compare = function (a, b) {
		let comp = library[a][property] == library[b][property] ? 0 : library[a][property] < library[b][property] ? -1 : 1;
		return comp == 0 ? tiebreaker(a, b) : comp;
	};

	tracker.data.sort(compare);
}