let upgrader = {
  defaultStrat: function (creep) {
    if (creep.memory.isWorking) {
      creep.memory.source = "none";

      creep.memory.target = creep.room.controller.id;
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, {
          visualizePathStyle: { stroke: "#ffffff" },
        });
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
          creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } });
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

module.exports = upgrader;
