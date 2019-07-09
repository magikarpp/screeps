let roleHarvester =
{
    defaultStrat: function(creep){
        if(creep.carry.energy == creep.carryCapacity){
            creep.memory.isWorking = true;
        } else if(creep.carry.energy == 0){
            creep.memory.isWorking = false;
        }

        let harvesters = _.filter(Game.creeps, (creeep) => (creeep.memory.role == 'harvester' && creeep.room == creep.room));
        
        if(harvesters.length > creep.room.memory.sources.length * Memory.workerNum - Memory.workerNum){
            if(creep.room.controller.level >= 2 && creep.room.find(FIND_MY_CONSTRUCTION_SITES).length > 0){
                creep.memory.role = 'builder';
            } else{
                creep.memory.role = 'upgrader';
            }
        } else{
            if(creep.memory.isWorking){
                creep.memory.source = 'none';

                let target = creep.pos.findClosestByRange(FIND_MY_SPAWNS,
                    {
                        filter: (structure) => {
                            return structure.energy < structure.energyCapacity;
                        }
                    });
    
                if(target){
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            } else{
                let source;

                if(creep.memory.source == 'none'){
                    let occupiedSources = {};

                    for(let creep in Game.creeps){
                        if(!occupiedSources[Game.creeps[creep].memory.source]){
                            occupiedSources[Game.creeps[creep].memory.source] = 1;
                        } else{
                            occupiedSources[Game.creeps[creep].memory.source]++;
                        }
                    }

                    source = creep.pos.findClosestByRange(FIND_SOURCES,
                        {
                            filter: (soource) => {
                                if(occupiedSources[soource.id]){
                                    return (occupiedSources[soource.id] < Memory.workerNum);
                                } else{
                                    return true;
                                }
                            }
                        });
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
        }
    },
    
    run: function(creep, strat){
        if(strat == 'default'){
            this.defaultStrat(creep);
        } else if(strat == ''){

        }
	}
};

module.exports = roleHarvester;