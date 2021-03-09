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

        //Drop road
        if(creep.room.memory.roadTrigger
            && creep.room.find(FIND_MY_CONSTRUCTION_SITES).length < creep.room.memory.scale
            && roads.needsRoad(creep)){
            creep.room.memory.roadTrigger = false;

            roads.dropRoad(creep);
        }

        if(creep.memory.isWorking){
            creep.memory.source = 'none';

            //Harvester
            if(creep.memory.role == 'harvester'){
                let target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES,
                    {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION
                                || structure.structureType == STRUCTURE_SPAWN
                                || structure.structureType == STRUCTURE_STORAGE
                                || structure.structureType == STRUCTURE_CONTAINER)
                                && (structure.energy < structure.energyCapacity);
                        }
                    });
    
                if(target){
                    creep.memory.target = target.id;

                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            //Helper
            } else if(creep.memory.role == 'helper'){
                let target = creep.room.find(FIND_MY_STRUCTURES,
                    {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity);
                        }
                    }).sort((a, b) => a.energy - b.energy)[0];
                if(target){
                    creep.memory.target = target.id;

                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                } else{
                    let target = util.getBrokenStructures(creep.room);

                    if(target.length > 0){
                        creep.memory.target = target.id;
    
                        if(creep.repair(target[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                            creep.moveTo(target[0], {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    }
                }
            //Upgrader  
            } else if(creep.memory.role == 'upgrader'){
                creep.memory.target = creep.room.controller.id;
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE){
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            //Builder
            } else if(creep.memory.role == 'builder'){
                let target = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);

				if(target){
                    creep.memory.target = target.id;

					if(creep.build(target) == ERR_NOT_IN_RANGE) {
						creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
					}
				} else{
                    creep.memory.role = 'upgrader';
                }
            }
        } else{
            let source;

            if(creep.memory.source == 'none'){
                if(creep.memory.role == 'builder' || creep.memory.role == 'helper' || creep.memory.role == 'upgrader'){
                    source = creep.pos.findClosestByRange(FIND_MY_STRUCTURES,
                        {
                            filter: (structure) => {
                                return (structure.structureType == STRUCTURE_EXTENSION
                                    || structure.structureType == STRUCTURE_SPAWN
                                    || structure.structureType == STRUCTURE_CONTAINER
                                    || structure.structureType == STRUCTURE_STORAGE)
                                    && (structure.energy > 40);
                            }
                        });
                } else{
                    let occupiedSources = {};
                    let workers = util.getWorkers(creep.room);

                    for(let dude in workers){
                        let theChosenOne = workers[dude];
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
                                    return (soource.energy > 0 && occupiedSources[soource.id] < creep.room.memory.scale + 1);
                                } else{
                                    return true;
                                }
                            }
                        });
                    if(!source){
                        source = creep.pos.findClosestByRange(FIND_SOURCES,
                            {
                                filter: (soource) => {
                                    return (soource.energy > 0);
                                }
                            });
                    }
                }
            } else{
                source = Game.getObjectById(creep.memory.source);
            }
            
            if(source){
                creep.memory.source = source.id;
                creep.memory.target = 'none';

                if(creep.memory.role == 'builder' || creep.memory.role == 'helper' || creep.memory.role == 'upgrader'){
                    if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                    if(creep.carry.energy != creep.carryCapacity){
                        creep.memory.source = 'none';
                    }
                } else{
                    if(source.energy == 0){
                        creep.memory.source = 'none';
                    }
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



module.exports = workerPool;