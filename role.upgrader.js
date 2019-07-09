let roleUpgrader =
{
    run: function(creep, strat){
	    if(strat == 'default'){
            if(creep.carry.energy == creep.carryCapacity){
                creep.memory.isWorking = true;
            } else if(creep.carry.energy == 0){
                creep.memory.isWorking = false;
            }
            
            if(creep.room.find(FIND_MY_CONSTRUCTION_SITES).length <  _.filter(Game.creeps, (creep) => (creep.memory.role == 'upgrader' && creep.room == room)).length / Memory.workerNum){
                creep.memory.role = 'builder';
            } else if(creep.memory.isWorking){
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