let roleHarvester =
{
    run: function(creep, strat){
        if(strat == 'default'){
            if(creep.carry.energy == creep.carryCapacity){
                creep.memory.isWorking = true;
            } else if(creep.carry.energy == 0){
                creep.memory.isWorking = false;
            }
            
            if(creep.memory.isWorking){
                let target = creep.pos.findClosestByRange(FIND_STRUCTURES,
                    {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION ||
                                    structure.structureType == STRUCTURE_SPAWN ||
                                    structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                        }
                    });
    
                if(target){
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            } else{
                let source = creep.pos.findClosestByRange(FIND_SOURCES);

                if(source){
                    if(creep.harvest(source) == ERR_NOT_IN_RANGE){
                        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
            }
        } else if(strat == ''){

        }

        creep.memory.tickCount--;
	}
};

module.exports = roleHarvester;