let workerPool = require('workerPool');
let soldierPool = require('soldierPool');
let towers = require('towerPool');

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
        console.log('Builders: ' + builders.length + ' (' + room.find(FIND_MY_CONSTRUCTION_SITES).length + ')');
        let helpers = util.getHelpers(room);
        console.log('Helpers: ' + helpers.length);

        let spawners = _.filter(Game.spawns, (spawn) => spawn.room == room);

        for(let i in spawners){
            let spawn = spawners[i];
            
            if(util.getHostiles(room).length > 0){
                room.memory.underAttack = true;
                if(util.getSoldiers(room).length < util.getHostiles(room).length){
                    creepMaker.makeSoldier(spawn);
                }
                towers.defendRoom(room);
            } else{
                room.memory.underAttack = false;
                creepMaker.makeWorker(spawn);
                towers.repairStructures(room);
            }
    
            //Spawner Visual
            if(spawn.spawning) {
                var spawningCreep = Game.creeps[spawn.spawning.name];
                spawn.room.visual.text(
                    'Spawning: ' + spawningCreep.memory.type,
                    spawn.pos.x + 1,
                    spawn.pos.y,
                    {align: 'left', opacity: 0.8});
            }
        }

        let workers = util.getWorkers(room);
        let soldiers = util.getSoldiers(room);

        //Creep Actions by Type
        for(let i in workers){
            workerPool.run(workers[i], 'default');
        }
        for(let i in soldiers){
            soldierPool.run(soldiers[i], 'default');
        }
	}
};

module.exports = defaultStrategy;