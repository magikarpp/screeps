let util = require("util");

let tower = {
  defendRoom: function (room) {
    let hostiles = room.find(FIND_HOSTILE_CREEPS);

    if (hostiles.length > 0) {
      let towers = util.getTowers(room);
      towers.forEach((tower) => tower.attack(hostiles[0]));
    }
  },
  repairStructures: function (room) {
    let structures = util.getBrokenStructures(room);

    if (structures.length > 0) {
      let towers = util.getTowers(room);
      let mostDamaged = structures.sort((a, b) => a.hits - b.hits);
      towers
        .filter(function (tower) {
          return tower.energy > tower.energyCapacity / 1.5;
        })
        .forEach((tower) => tower.repair(mostDamaged[0]));
    }
  },
};

module.exports = tower;
