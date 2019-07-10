let workerPool = require('workerPool');
let soldierPool = require('soldierPool');

let util = require('util');
let creepMaker = require('spawn.creepMaker');

let defaultStrategy =
{
    run: function(room){
        //Unit Statistics
        let harvesters = util.getHarvesters(room);
        console.log('Harvesters: ' + harvesters.length);
        let upgraders = util.getUpgraders(room);
        console.log('Upgraders: ' + upgraders.length);
        let builders = util.getBuilders(room);
        console.log('Builders: ' + builders.length);

        let spawners = _.filter(Game.spawns, (spawn) => spawn.room == room);

        for(let i in spawners){
            let spawn = spawners[i];

            if(util.getHostiles.length > 0 && util.getSoldiers.length < room.find(FIND_HOSTILE_CREEPS).length){
                creepMaker.makeSoldier(spawn);
            } else{
                creepMaker.makeWorker(spawn);
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

        let workers = util.getWorkers(room);
        let soldiers = util.getSoldiers(room);

        //Creep Actions by Role
        for(let i in workers){
            workerPool.run(workers[i], 'default');
        }
        for(let i in soldiers){
            soldierPool.run(soldiers[i], 'default');
        }
	}
};

module.exports = defaultStrategy;