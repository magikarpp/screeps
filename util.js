let util = {
  getAllCreeps: function (room) {
    return _.filter(Game.creeps, (creep) => creep.room == room);
  },
  getHarvesters: function (room) {
    return _.filter(
      Game.creeps,
      (creep) => creep.memory.role == "harvester" && creep.room == room
    );
  },
  getUpgraders: function (room) {
    return _.filter(
      Game.creeps,
      (creep) => creep.memory.role == "upgrader" && creep.room == room
    );
  },
  getBuilders: function (room) {
    return _.filter(
      Game.creeps,
      (creep) => creep.memory.role == "builder" && creep.room == room
    );
  },
  getHelpers: function (room) {
    return _.filter(
      Game.creeps,
      (creep) => creep.memory.role == "helper" && creep.room == room
    );
  },
  getWorkers: function (room) {
    return _.filter(
      Game.creeps,
      (creep) => creep.memory.type == "worker" && creep.room == room
    );
  },
  getSoldiers: function (room) {
    return _.filter(
      Game.creeps,
      (creep) => creep.memory.type == "soldier" && creep.room == room
    );
  },
  getHostiles: function (room) {
    return room.find(FIND_HOSTILE_CREEPS);
  },
  getWithdrawables: function (room) {
    return room.find(FIND_MY_STRUCTURES, (structure) => {
      return (
        structure.structureType == STRUCTURE_EXTENSION ||
        structure.structureType == STRUCTURE_STORAGE ||
        structure.structureType == STRUCTURE_CONTAINER
      );
    });
  },
  getExtensions: function (room) {
    return room.find(FIND_MY_STRUCTURES, (structure) => {
      return structure.structureType == STRUCTURE_EXTENSION;
    });
  },
  getTowers: function (room) {
    return room.find(FIND_MY_STRUCTURES, {
      filter: { structureType: STRUCTURE_TOWER },
    });
  },
  getBrokenStructures(room) {
    return room.find(FIND_STRUCTURES, {
      filter: (structure) => structure.hits < structure.hitsMax,
    });
  },
};

module.exports = util;
