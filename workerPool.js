let roads = require("roads");
let harvester = require("role.harvester");
let upgrader = require("role.upgrader");
let helper = require("role.helper");
let builder = require("role.builder");

let workerPool = {
  defaultStrat: function (creep) {
    if (creep.carry.energy == creep.carryCapacity) {
      creep.memory.isWorking = true;
    } else if (creep.carry.energy == 0) {
      creep.memory.isWorking = false;
    }

    //Drop road
    if (
      creep.room.memory.roadTrigger &&
      creep.room.find(FIND_MY_CONSTRUCTION_SITES).length <
        creep.room.memory.scale &&
      roads.needsRoad(creep)
    ) {
      creep.room.memory.roadTrigger = false;

      roads.dropRoad(creep);
    }

    if (creep.memory.role == "harvester") {
      harvester.run(creep, "default");
    } else if (creep.memory.role == "upgrader") {
      upgrader.run(creep, "default");
    } else if (creep.memory.role == "helper") {
      helper.run(creep, "default");
    } else if (creep.memory.role == "builder") {
      builder.run(creep, "default");
    }
  },
  run: function (creep, strat) {
    if (strat == "default") {
      this.defaultStrat(creep);
    } else if (strat == "") {
    }
  },
};

module.exports = workerPool;
