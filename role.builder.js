let util = require("util");

let builder = {
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
        target = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
      }

      if (target) {
        creep.memory.target = target.id;

        if (creep.build(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target, {
            reusePath: 50,
            visualizePathStyle: { stroke: "#ffffff" },
          });
        }
      } else {
        creep.memory.role = "upgrader";
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

module.exports = builder;
