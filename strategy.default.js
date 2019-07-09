let roleHarvester = require('role.harvester');
let roleUpgrader = require('role.upgrader');
let roleBuilder = require('role.builder');

let defaultStrategy =
{
    run: function(room){
        //Unit Statistics
        let harvesters = _.filter(Game.creeps, (creep) => (creep.memory.role == 'harvester' && creep.room == room));
        console.log('Harvesters: ' + harvesters.length);
        let upgraders = _.filter(Game.creeps, (creep) => (creep.memory.role == 'upgrader' && creep.room == room));
        console.log('Upgraders: ' + upgraders.length);
        let builders = _.filter(Game.creeps, (creep) => (creep.memory.role == 'builder' && creep.room == room));
        console.log('Builders: ' + builders.length);

        let spawners = _.filter(Game.spawns, (spawn) => spawn.room == room);

        for(let i in spawners){
            let spawn = spawners[i];
            if(harvesters.length < room.memory.sources.length * 3 && _.filter(builders, (creep) => creep.isWorking).length == 0){
                spawn.createCreep([WORK,CARRY,MOVE], undefined,
                    {
                        role: 'harvester',
                        isWorking: false,
                        source: 'none'
                    });
            }
    
            //Spawner Visual
            if(spawn.spawning) {
                var spawningCreep = Game.creeps[spawn.spawning.name];
                spawn.room.visual.text(
                    'Spawning: ' + spawningCreep.memory.role,
                    spawn.pos.x + 1,
                    spawn.pos.y,
                    {align: 'left', opacity: 0.8});
            }
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