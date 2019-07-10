let roleBuilder =
{
	defaultStrat: function(creep){
		if(creep.carry.energy == creep.carryCapacity){
			creep.memory.isWorking = true;
		} else if(creep.carry.energy == 0){
			creep.memory.isWorking = false;
		}
		
		if(creep.memory.isWorking){
			creep.memory.source = 'none';

			let harvesters = _.filter(Game.creeps, (creeep) => (creeep.memory.role == 'harvester' && creeep.room == creep.room));

			if(harvesters.length < creep.room.memory.sources.length * Memory.workerNum - (Memory.workerNum + 2)){
				creep.memory.role = 'harvester';
			} else{
				let target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);

				if(target){
					if(creep.build(target) == ERR_NOT_IN_RANGE) {
						creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
					}
				} else{
					creep.memory.role = 'harvester';
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
									return (occupiedSources[soource.id] < Memory.workerNum + 2);
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

module.exports = roleBuilder;