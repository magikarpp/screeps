let util = require("util");
let roads = require("roads");
let harvester = require("role.harvester");

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
    } else if (creep.memory.isWorking) {
      creep.memory.source = "none";

      if (creep.memory.role == "helper") {
        let target = creep.room
          .find(FIND_MY_STRUCTURES, {
            filter: (structure) => {
              return (
                structure.structureType == STRUCTURE_TOWER &&
                structure.energy < structure.energyCapacity
              );
            },
          })
          .sort((a, b) => a.energy - b.energy)[0];
        if (target) {
          creep.memory.target = target.id;

          if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
          }
        } else {
          let target = util.getBrokenStructures(creep.room);

          if (target.length > 0) {
            creep.memory.target = target.id;

            if (creep.repair(target[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.moveTo(target[0], {
                visualizePathStyle: { stroke: "#ffffff" },
              });
            }
          }
        }
        //Upgrader
      } else if (creep.memory.role == "upgrader") {
        creep.memory.target = creep.room.controller.id;
        if (
          creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE
        ) {
          creep.moveTo(creep.room.controller, {
            visualizePathStyle: { stroke: "#ffffff" },
          });
        }
        //Builder
      } else if (creep.memory.role == "builder") {
        let target = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);

        if (target) {
          creep.memory.target = target.id;

          if (creep.build(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
          }
        } else {
          creep.memory.role = "upgrader";
        }
      }
    } else {
      let source;

      if (creep.memory.source == "none") {
        if (
          creep.memory.role == "builder" ||
          creep.memory.role == "helper" ||
          creep.memory.role == "upgrader"
        ) {
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
        }
      } else {
        source = Game.getObjectById(creep.memory.source);
      }

      if (source) {
        creep.memory.source = source.id;
        creep.memory.target = "none";

        if (
          creep.memory.role == "builder" ||
          creep.memory.role == "helper" ||
          creep.memory.role == "upgrader"
        ) {
          if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } });
          }
          if (creep.carry.energy != creep.carryCapacity) {
            creep.memory.source = "none";
          }
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

module.exports = workerPool;
