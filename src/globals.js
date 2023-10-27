let repo = "JwowSquared/Radical-Red-Pokedex";
let version = "rrdex release 1.1.1.1";

let species = null;
let sprites = null;
let abilities = null;
let moves = null;
let locations = null;
let types = null;
let caps = null;
let eggGroups = null;
let evolutionItems = null;
let heldItems = null;
let regions = null;
let splits = null;
let evolutions = null;
let stats = null;

let trackers = {};
let filters = {};

let scrollIntoView = true;

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