let util = require('util');

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
        if(creep.room.controller.level >= 2 && creep.room.find(FIND_MY_CONSTRUCTION_SITES).length < maxLength / Memory.scale - 1){
            console.log('TEST: ' + creep.room.find(FIND_MY_CONSTRUCTION_SITES).length);
            this.dropRoad(creep);
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
    },

    dropRoad: function(creep){
        if(this.needsRoad(creep)){
            creep.say("Road Here.", false);
            creep.room.createConstructionSite(creep, STRUCTURE_ROAD);
        }
    },
    needsRoad: function(creep) {
        let objects = creep.room.lookAt(creep);
        let res = objects.find(o => {
            return (o.type == LOOK_CONSTRUCTION_SITES && o.constructionSite.structureType == STRUCTURE_ROAD)
                || (o.type == LOOK_STRUCTURES && o.structure.structureType == STRUCTURE_ROAD)
        });

        return res == undefined;
    }
};

module.exports = workerPool;