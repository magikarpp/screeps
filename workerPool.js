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
        if(util.getWithdrawables(creep.room).length > 1){
            maxLength = creep.room.memory.sources.length * Memory.scale;
        }

        //Change roles based on whats needed
        if(harvesters.length > maxLength){
            if(creep.room.controller.level >= 2
                && creep.room.find(FIND_MY_CONSTRUCTION_SITES).length * Math.ceil(Memory.scale/1.5) > util.getBuilders(creep.room).length){

                creep.memory.role = 'builder';
            } else{
                creep.memory.role = 'upgrader';
            }
        } else if(harvesters.length < maxLength){
            creep.memory.role = 'harvester';
        }

        //Drop road
        if(creep.memory.role == 'harvester' && Memory.roadTrigger && creep.room.find(FIND_MY_CONSTRUCTION_SITES).length < maxLength / 3){
            Memory.roadTrigger = false;

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
            //Upgrader
            } else if(creep.memory.role == 'upgrader'){
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE){
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            //Builder
            } else if(creep.memory.role == 'builder'){

                let occupiedConstructionSites = {};

                for(let dude in util.getBuilders(creep.room)){
                    let theChosenOne = util.getBuilders(creep.room)[dude];
                    if(!occupiedConstructionSites[theChosenOne.memory.target]){
                        occupiedConstructionSites[theChosenOne.memory.target] = 1;
                    } else{
                        occupiedConstructionSites[theChosenOne.memory.target]++;
                    }
                }

                let target = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES,
                    {
                        filter: (site) => {
                            if(occupiedConstructionSites[site.id]){
                                return (occupiedConstructionSites[site.id] < Math.ceil(Memory.scale/1.5));
                            } else{
                                return true;
                            }
                        }
                    });

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
                //Builders take energy from Spawn (and upgraders after some time)
                if(creep.memory.role == 'builder' || (creep.memory.role == 'upgrader' && util.getWithdrawables(creep.room).length > 1)){
                    source = creep.pos.findClosestByRange(FIND_MY_STRUCTURES,
                        {
                            filter: (structure) => {
                                return (structure.structureType == STRUCTURE_EXTENSION
                                    || structure.structureType == STRUCTURE_SPAWN
                                    || structure.structureType == STRUCTURE_CONTAINER)
                                    && (structure.energy < structure.energyCapacity)
                                    && (structure.energy > creep.carryCapacity / 2);
                            }
                        });
                } else{
                    let occupiedSources = {};

                    for(let dude in util.getWorkers(creep.room)){
                        let theChosenOne = util.getWorkers(creep.room)[dude];
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
                    if(!source){
                        source = creep.pos.findClosestByRange(FIND_SOURCES);
                    }
                }
            } else{
                source = Game.getObjectById(creep.memory.source);
            }
            
            if(source){
                creep.memory.source = source.id;
                creep.memory.target = 'none';

                if(creep.memory.role == 'builder'){
                    if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                } else{
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