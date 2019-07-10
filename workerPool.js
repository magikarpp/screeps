let util = require('util');
let roads = require('roads');

let workerPool =
{
    defaultStrat: function(creep){
        if(creep.carry.energy == creep.carryCapacity){
            creep.memory.isWorking = true;
        } else if(creep.carry.energy == 0){
            creep.memory.isWorking = false;
        }

        let harvesters = util.getHarvesters(creep.room);
        let maxLength = creep.room.memory.sources.length * Memory.scale - Memory.scale;
        //Change roles based on whats needed
        if(harvesters.length >= maxLength){
            if(creep.room.controller.level >= 2 && creep.room.find(FIND_MY_CONSTRUCTION_SITES).length > util.getBuilders(creep.room).length){
                creep.memory.role = 'builder';
            } else{
                creep.memory.role = 'upgrader';
            }
        } else if(harvesters.length < maxLength - 1){
            creep.memory.role = 'harvester';
        }

        //Drop road
        if(creep.room.controller.level >= 2 && creep.room.find(FIND_MY_CONSTRUCTION_SITES).length < maxLength / 3){
            //TODO: WHY IS THIS HAPPENING FOR ALL CREEPS AT THE SAME TIME???
            console.log('Con_Sites: ' + creep.room.find(FIND_MY_CONSTRUCTION_SITES).length);
            roads.dropRoad(creep);
        }

        if(creep.memory.isWorking){
            creep.memory.source = 'none';

            //Harvester
            if(creep.memory.role == 'harvester'){
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
            //Upgrader
            } else if(creep.memory.role == 'upgrader'){
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE){
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            //Builder
            } else if(creep.memory.role == 'builder'){
                let target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);

				if(target){
					if(creep.build(target) == ERR_NOT_IN_RANGE) {
						creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
					}
				}
            }
        } else{
            let source;

            if(creep.memory.source == 'none'){
                let occupiedSources = {};

                for(let creep in Game.creeps){
                    let theChosenOne = Game.creeps[creep];
                    if(!occupiedSources[theChosenOne.memory.source]){
                        occupiedSources[theChosenOne.memory.source] = 1;
                    } else{
                        occupiedSources[theChosenOne.memory.source]++;
                    }
                }

                source = creep.pos.findClosestByRange(FIND_SOURCES,
                    {
                        filter: (soource) => {
                            if(occupiedSources[soource.id]){
                                return (occupiedSources[soource.id] < Memory.scale + 1);
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
    },
    run: function(creep, strat){
        if(strat == 'default'){
            this.defaultStrat(creep);
        } else if(strat == ''){

        }
    }
};

module.exports = workerPool;