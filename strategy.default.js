let roleHarvester = require('role.harvester');
let roleUpgrader = require('role.upgrader');
let roleBuilder = require('role.builder');

let defaultStrategy =
{
    run: function(roomName){
        let room = Game.rooms[roomName];

        let harvesters = _.filter(Game.creeps, (creep) => (creep.memory.role == 'harvester' && creep.memory.room == roomName));
        console.log('Harvesters: ' + harvesters.length);
        let upgraders = _.filter(Game.creeps, (creep) => (creep.memory.role == 'upgraders' && creep.memory.room == roomName));
        console.log('Upgraders: ' + upgraders.length);
        let builders = _.filter(Game.creeps, (creep) => (creep.memory.role == 'builders' && creep.memory.room == roomName));
        console.log('Builders: ' + builders.length);

        if(harvesters.length < 3){
            Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], "Harvester #" + (harvesters.length + 1),
                {
                    role: 'harvester',
                    action: 'spawning',
                    tickCount: 1500,
                    room: roomName
                });
        }

        //Creep Actions by Role
        for(let i in harvesters){
            roleHarvester.run(harvesters[i], 'default');
        }
        for(let i in upgraders){
            roleUpgrader.run(harvesters[i], 'default');
        }
        for(let i in builders){
            roleBuilder.run(harvesters[i], 'default');
        }
	}
};

module.exports = defaultStrategy;