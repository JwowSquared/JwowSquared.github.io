let repo = "JwowSquared/JwowSquared.github.io";
let version = "rrdex release 1.1.2.6.7";

let species = null;
let moves = null;
let abilities = null;
let items = null;
let areas = null;
let tmMoves = null;
let tutorMoves = null;
let sprites = null;
let trainers = null;

let trackers = {};
let filters = {};

let scrollIntoView = true;

let types = {
	0: {ID:0, name: 'Normal', color: '#A8A77A'},
	1: {ID:1, name: 'Fighting', color: '#C22E28'},
	2: {ID:2, name: 'Flying', color: '#8571BE'},
	3: {ID:3, name: 'Poison', color: '#A33EA1'},
	4: {ID:4, name: 'Ground', color: '#B1954F'},
	5: {ID:5, name: 'Rock', color: '#B6A136'},
	6: {ID:6, name: 'Bug', color: '#808F13'},
	7: {ID:7, name: 'Ghost', color: '#735797'},
	8: {ID:8, name: 'Steel', color: '#8C8C9E'},
	10: {ID:10, name: 'Fire', color: '#EE8130'},
	11: {ID:11, name: 'Water', color: '#6390F0'},
	12: {ID:12, name: 'Grass', color: '#62A13D'},
	13: {ID:13, name: 'Electric', color: '#CF9A09'},
	14: {ID:14, name: 'Psychic', color: '#F95587'},
	15: {ID:15, name: 'Ice', color: '#65A19E'},
	16: {ID:16, name: 'Dragon', color: '#6F35FC'},
	17: {ID:17, name: 'Dark', color: '#705746'},
	23: {ID:23, name: 'Fairy', color: '#D685AD'},
};

let splits = {
	0: 'Physical',
	1: 'Special',
	2: 'Status'
};

let evolutions = {
	//evo_none
	1: "`on Level Up with Friendship`",
	2: "`on Level Up with Friendship (Day)`",
	3: "`on Level Up with Friendship (Night)`",
	4: "`at Level ${evo[1]}`",
	//evo_trade
	//evo_trade_item
	7: "`with a ${items[evo[1]].name}${evo[1] !== 101 ? '' : evo[3] === 254 ? ' (Female)' : ' (Male)'}`",
    8: "`at Level ${evo[1]} when Attack > Defense`",
	9: "`at Level ${evo[1]} when Attack = Defense`",
	10: "`at Level ${evo[1]} when Attack < Defense`",
	11: "`at Level ${evo[1]}, with a 50% chance`", //silcoon
    12: "`at Level ${evo[1]}, with a 50% chance`", //cascoon
	13: "`at Level ${evo[1]}`", //ninjask
	14: "`when evolving to Ninjask with Open Party Slot & Poke Ball`", //shedinja
	//evo_beauty
	16: "`at Level ${evo[1]} with Overworld Rain`",
	17: "`on Level Up with Friendship and knowing a ${types[evo[1]].name} Type move`",
	18: "`at Level ${evo[1]} with ${types[evo[3]].name} Type in Party`",
	//evo_map
	20: "`at Level ${evo[1]} (Male)`",
	21: "`at Level ${evo[1]} (Female)`",
	22: "`at Level ${evo[1]} (Night)`",
	23: "`at Level ${evo[1]} (Day)`",
	//evo_hold_item_night
	//evo_hold_item_day
	26: "`on Level Up with the move ${moves[evo[1]].name}`",
	27: "`on Level Up with ${species[evo[1]].name} in Party`",
	28: "`at Level ${evo[1]} ${evo[3] === 1041 ? (Day) : evo[3] === 5144 ? '(Night)' : '(Dusk)'}`",
	
	//UNKNOWN
    30: "`at Level ${evo[1]} with Adamant, Brave, Docile, Hardy, Hasty, Impish, Jolly, Lax, Naive, Naughty, Rash, Quirky, or Sassy Nature`",
    31: "`at Level ${evo[1]} with Bashful, Bold, Calm, Careful, Gentle, Lonely, Mild, Modest, Quiet, Relaxed, Serious, or Timid Nature`",

	//0xFE
    254: "`with the ${evo[3] === 2 ? 'move ' + moves[evo[1]].name : items[evo[1]].name}`",
};