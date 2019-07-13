let util = {
    getAllCreeps: function(room){
        return _.filter(Game.creeps, (creep) => (creep.room == room));
    },
    getHarvesters: function(room){
        return _.filter(Game.creeps, (creep) => (creep.memory.role == 'harvester' && creep.room == room));
    },
    getUpgraders: function(room){
        return _.filter(Game.creeps, (creep) => (creep.memory.role == 'upgrader' && creep.room == room));
    },
    getBuilders: function(room){
        return _.filter(Game.creeps, (creep) => (creep.memory.role == 'builder' && creep.room == room));
    },
    getWorkers: function(room){
        return _.filter(Game.creeps, (creep) => (creep.memory.type == 'worker' && creep.room == room));
    },
    getSoldiers: function(room){
        return _.filter(Game.creeps, (creep) => (creep.memory.type == 'soldier' && creep.room == room));
    },
    getHostiles: function(room){
        return targets = room.find(FIND_HOSTILE_CREEPS,
            {
                filter: (c) => {
                    return c.name != 'Source Keeper'
                }
            });
    },
    getWithdrawables: function(room){
        return _.filter(FIND_MY_STRUCTURES,
            (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION && structure.room == room)
                    || (structure.structureType == STRUCTURE_STORAGE && structure.room == room)
                    || (structure.structureType == STRUCTURE_CONTAINER && structure.room == room);
            });
    }
}

module.exports = util;