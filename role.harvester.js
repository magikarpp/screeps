let util = require("util");

let harvester = {
  defaultStrat: function (creep) {
    if (creep.memory.isWorking) {
      creep.memory.source = "none";

      let target;

      if (
        creep.memory.target != "none" &&
        Game.getObjectById(creep.memory.target).energy <
          Game.getObjectById(creep.memory.target).energyCapacity
      ) {
        target = Game.getObjectById(creep.memory.target);
      } else {
        target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
          filter: (structure) => {
            return (
              (structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_SPAWN ||
                structure.structureType == STRUCTURE_STORAGE ||
                structure.structureType == STRUCTURE_CONTAINER) &&
              structure.energy < structure.energyCapacity
            );
          },
        });
      }

      if (target) {
        creep.memory.target = target.id;

        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target, {
            reusePath: 50,
            visualizePathStyle: { stroke: "#ffffff" },
          });
        }
      }
    } else {
      let source;

      if (creep.memory.source == "none") {
        let occupiedSources = {};
        let workers = util.getWorkers(creep.room);

        for (let dude in workers) {
          let theChosenOne = workers[dude];
          if (!occupiedSources[theChosenOne.memory.source]) {
            occupiedSources[theChosenOne.memory.source] = 1;
          } else {
            occupiedSources[theChosenOne.memory.source]++;
          }
        }

        source = creep.pos.findClosestByRange(FIND_SOURCES, {
          filter: (soource) => {
            if (occupiedSources[soource.id]) {
              return (
                soource.energy > 0 &&
                occupiedSources[soource.id] < creep.room.memory.scale + 1
              );
            } else {
              return true;
            }
          },
        });
        if (!source) {
          source = creep.pos.findClosestByRange(FIND_SOURCES, {
            filter: (soource) => {
              return soource.energy > 0;
            },
          });
        }
      } else {
        source = Game.getObjectById(creep.memory.source);
      }

      if (source) {
        creep.memory.source = source.id;
        creep.memory.target = "none";

        if (source.energy == 0) {
          creep.memory.source = "none";
        }
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
          creep.moveTo(source, {
            reusePath: 50,
            visualizePathStyle: { stroke: "#ffaa00" },
          });
        }
      }
    }
  },
  run: function (creep, strat) {
    if (strat == "default") {
      this.defaultStrat(creep);
    } else if (strat == "") {
    }
  },
};

module.exports = harvester;
