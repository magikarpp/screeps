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
        let targets = room.find(FIND_HOSTILE_CREEPS,
            {
                filter: (c) => {
                    return c.name != 'Source Keeper'
                }
            });
        return targets;
    }
}

module.exports = util;