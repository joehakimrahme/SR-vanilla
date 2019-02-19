const RACES = [
  "Altmer (High Elf)",
  "Argonian",
  "Bosmer (Wood Elf)",
  "Breton",
  "Dunmer (Dark Elf)",
  "Imperial",
  "Khajit",
  "Nord",
  "Orsimer (Orc)",
  "Redguard",
]

const FIGHT_SKILLS = [
  "Archery",
  "Conjuration",
  "Destruction",
  "Illusion",
  "One-handed",
  "Two-handed",
]

const TRADE_SKILLS = [
  "Alchemy",
  "Enchanting",
  "Smithing",
  "Speech",
]

const NEUTRAL_SKILLS = [
  "Alteration",
  "Block",
  "Heavy Armor",
  "Light Armor",
  "Lockpicking",
  "Pickpocket",
  "Restoration",
  "Sneak",
]

const HANDICAPS = [
  "Insomniac",
  "Stoned",
  "Pious Mortal",
  "Disgrace to your Race",
  "Body Odour",
  "Dragonfool",
  "Agoraphobic",
  "Seasoned Traveler",
  "Permadeath",
]


const QUESTS = [
  "Alduin",
  "Civil War (Imperials)",
  "Civil War (Stormcloacks)",
  "College of Winterhold",
  "Companions",
  "Thieves Guild",
  "Dark Brotherhood",
]

const CONDITIONS = {
  "trade": function (r) {
    // have either one major trade skill
    var majorTradeCount = 0;
    for (var skill of r.major_skills) {
      if (TRADE_SKILLS.indexOf(skill) > -1) {
	  majorTradeCount++;
      }
    }
    // or 2 minor skills
    var minorTradeCount = 0;
    for (var skill of r.minor_skills) {
      if (TRADE_SKILLS.indexOf(skill) > -1) {
	minorTradeCount++;
      }
    }
    if (majorTradeCount >= 1) {
      return true;
    } else if (minorTradeCount >= 2) {
      return true;
    } else {
      return false;
    }
  },
  "darkbro-sleep": function (r) {
    return !(r.handicap.indexOf("Insomniac") > -1 && r.quest === "Dark Brotherhood");
  }
}


function choice(stuff) {
    // Returns a random element in an array
    var idx = Math.floor(Math.random() * stuff.length);
    return stuff[idx];
}

function shuffle(a) {
    // Use the modern version of the Fisher–Yates shuffle algorithm:
    // Shamelessly copied from https://stackoverflow.com/a/6274381/403401
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function randomRace() {
    return choice(RACES);
}

function randomSkills() {
    _skills = FIGHT_SKILLS.concat(TRADE_SKILLS);
    _skills = _skills.concat(NEUTRAL_SKILLS);
    shuffle(_skills);
    return _skills;
}

function randomHandicap() {
    // Go over the list of handicaps and run a check to see if it procs.
    // Every time a handicap procs, the odds of subsequent ones is halved.
    var i;
    var odds = 8;
    var result = [];
    for (i=0; i<HANDICAPS.length; i++) {
	if (Math.random() * 100 < odds) {
	    result.push(HANDICAPS[i]);
	    odds /= 2;
	}
    }
    return result;
}


function Roulette() {
    this.race = choice(RACES);
    this.skills = randomSkills();
    this.major_skills = this.skills.slice(0, 3);
    this.minor_skills = this.skills.slice(3, 6);
    this.handicap = randomHandicap();
    this.quest = choice(QUESTS);
}

function isValid(r) {
    for (let cond in CONDITIONS) {
	if (!CONDITIONS[cond](r)) {
	    console.log("Reshuffle: " + cond);
	    return false;
	}
    }
    return true;
}

function displayRoulette(r) {
    tdRace = document.getElementById("roulette-race");
    tdRace.innerHTML = r.race;
    tdMajor = document.getElementById("roulette-major");
    tdMajor.innerHTML = r.major_skills.join(", ");
    tdMinor = document.getElementById("roulette-minor");
    tdMinor.innerHTML = r.minor_skills.join(", ");
    tdHandicap = document.getElementById("roulette-handicap");
    tdHandicap.innerHTML = r.handicap.join(", ");
    tdQuest = document.getElementById("roulette-quest");
    tdQuest.innerHTML = r.quest;
}



do {
    r = new Roulette();
} while (! isValid(r));
console.log(r);
displayRoulette(r);
