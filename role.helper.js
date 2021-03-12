let util = require("util");

let helper = {
  defaultStrat: function (creep) {
    if (creep.memory.isWorking) {
      creep.memory.source = "none";

      let target;

      if (
        creep.memory.target &&
        creep.memory.target != "none" &&
        Game.getObjectById(creep.memory.target).energy <
          Game.getObjectById(creep.memory.target).energyCapacity
      ) {
        target = Game.getObjectById(creep.memory.target);
      } else {
        target = creep.room
          .find(FIND_MY_STRUCTURES, {
            filter: (structure) => {
              return (
                structure.structureType == STRUCTURE_TOWER &&
                structure.energy < structure.energyCapacity
              );
            },
          })
          .sort((a, b) => a.energy - b.energy)[0];
      }

      if (target) {
        creep.memory.target = target.id;

        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target, {
            reusePath: 50,
            visualizePathStyle: { stroke: "#ffffff" },
          });
        }
      } else {
        let target = util.getBrokenStructures(creep.room);

        if (target.length > 0) {
          creep.memory.target = target.id;

          if (creep.repair(target[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target[0], {
              reusePath: 50,
              visualizePathStyle: { stroke: "#ffffff" },
            });
          }
        }
      }
    } else {
      let source;

      if (creep.memory.source == "none") {
        source = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
          filter: (structure) => {
            return (
              (structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_SPAWN ||
                structure.structureType == STRUCTURE_CONTAINER ||
                structure.structureType == STRUCTURE_STORAGE) &&
              structure.energy > 40
            );
          },
        });
      } else {
        source = Game.getObjectById(creep.memory.source);
      }

      if (source) {
        creep.memory.source = source.id;
        creep.memory.target = "none";

        if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(source, {
            reusePath: 50,
            visualizePathStyle: { stroke: "#ffaa00" },
          });
        }
        if (creep.carry.energy != creep.carryCapacity) {
          creep.memory.source = "none";
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

module.exports = helper;
