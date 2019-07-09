let roleUpgrader =
{
    run: function(creep, strat){
	    if(strat == 'default'){
            if(creep.carry.energy == creep.carryCapacity){
                creep.memory.isWorking = true;
            } else if(creep.carry.energy == 0){
                creep.memory.isWorking = false;
            }

            let harvesters = _.filter(Game.creeps, (creeep) => (creeep.memory.role == 'harvester' && creeep.room == creep.room));
            
            if(harvesters.length == creep.room.memory.sources.length * 3){
                if(creep.room.find(FIND_MY_CONSTRUCTION_SITES).length > 0){
                    creep.memory.role = 'builder';
                } else{
                    creep.memory.role = 'upgrader';
                }
            } else{
                creep.memory.role = 'harvester';
            }

            if(creep.memory.isWorking){
                creep.memory.source = 'none';

                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE){
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else{
                let source;

                if(creep.memory.source == 'none'){
                    source = creep.pos.findClosestByRange(FIND_SOURCES);
                } else{
                    source = Game.getObjectById(creep.memory.source);
                }
                
                if(source){
                    creep.memory.source = source.id;

                    if(creep.harvest(source) == ERR_NOT_IN_RANGE){
                        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
            }
        } else if(strat == ''){

        }
	}
};

module.exports = roleUpgrader;