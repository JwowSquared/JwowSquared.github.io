let repo = "JwowSquared/JwowSquared.github.io";
let version = "rrdex release 1.1.0.2";

let species = null;
let sprites = null;
let abilities = null;
let moves = null;
let locations = null;
let types = null;
let caps = null;
let eggGroups = null;
let items = null;
let regions = null;

let splits = {
	"SPLIT_PHYSICAL": {"name": "Physical", "color": "#f75231"},
	"SPLIT_SPECIAL": {"name": "Special", "color": "#5273ad"},
	"SPLIT_STATUS": {"name": "Status", "color": "#ada594"}
};

let evolutions = {
	"EVO_LEVEL": "`at Level ${evo[1]}`",
	"EVO_LEVEL_DAY": "`at Level ${evo[1]} (Day)`",
	"EVO_LEVEL_NIGHT": "`at Level ${evo[1]} (Night)`",
	"EVO_LEVEL_MALE": "`at Level ${evo[1]} (Male)`",
	"EVO_LEVEL_FEMALE": "`at Level ${evo[1]} (Female)`",
	"EVO_FRIENDSHIP": "`on Level Up with Friendship`",
	"EVO_FRIENDSHIP_DAY": "`on Level Up with Friendship (Day)`",
	"EVO_FRIENDSHIP_NIGHT": "`on Level Up with Friendship (Night)`",
	"EVO_ITEM": "`with a ${items[evo[1]].name}`",
	"EVO_MOVE": "`on Level Up with the move ${moves[evo[1]].name}`",
	"EVO_MOVE_TYPE": "`on Level Up with Friendship and knowing a Fairy type move`",
	"EVO_LEVEL_DUSK": "`at Level ${evo[1]} (Dusk)`",
	"EVO_HITMONLEE": "`at Level ${evo[1]} when Attack > Defense`",
	"EVO_HITMONTOP": "`at Level ${evo[1]} when Attack = Defense`",
	"EVO_HITMONCHAN": "`at Level ${evo[1]} when Attack < Defense`",
	"EVO_SHEDINJA": "`at Level ${evo[1]} with Open Party Slot & Poke Ball`",
	"EVO_MANTINE": "`on Level Up with Remoraid in Party`",
	"EVO_PANGORO": "`at Level ${evo[1]} with Dark Type in Party`",
	"EVO_GOODRA": "`at Level ${evo[1]} with Overworld Rain`",
	"EVO_TOXTRICITY_AMPED": "`at Level ${evo[1]} with Adamant, Brave, Docile, Hardy, Hasty, Impish, Jolly, Lax, Naive, Naughty, Rash, Quirky, or Sassy Nature`",
	"EVO_TOXTRICITY_LOWKEY": "`at Level ${evo[1]} with Bashful, Bold, Calm, Careful, Gentle, Lonely, Mild, Modest, Quiet, Relaxed, Serious, or Timid Nature`"
};

let trackers = {};
let filters = {};

function fullSpeciesName(key) {
	let mon = species[key];
	let output = "";
	if (mon.family.forms && species[mon.family.forms[0]].family.region !== mon.family.region)
		output += regions[mon.family.region].variant + " ";
	
	output += species[key].name;
	
	if (mon.family.form)
		output += " " + mon.family.form;
	
	return output;
}

function buildPrevoExclusiveMoves(ancestor, target) {

	let evoPath = findEvoPath(ancestor, target);
	if (evoPath.length <= 1)
		return [];
	
	evoPath.splice(0, 1);
	let prevoMoves = [];
	for (const key of evoPath) {
		prevoMoves = prevoMoves.concat(species[key].learnset.levelup);
	}
	
	let targetMoves = [];
	targetMoves = targetMoves.concat(species[target].learnset.levelup);
	
	let uniquePrevoMoves = {};
	for (const [move, level] of prevoMoves) {
		if (!(move in uniquePrevoMoves) || uniquePrevoMoves[move] > level)
			uniquePrevoMoves[move] = level;
	}
	prevoMoves = Object.keys(uniquePrevoMoves).map(x => [x, uniquePrevoMoves[x]]);
	
	return prevoMoves.filter(x => targetMoves.filter(y => y[0] === x[0]).length === 0);
}

function findEvoPath(current, target) {
	if (current === target)
		return [current];

	if (!species[current].family.evolutions)
		return [];
	
	for (const evo of species[current].family.evolutions) {
		let results = findEvoPath(evo[2], target);
		if (results.length > 0)
			return results.concat([current]);
	}
	
	return [];
}