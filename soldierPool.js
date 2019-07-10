let util = require('util');

let soldierPool =
{
    defaultStrat: function(creep){
        let target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS,
            {
                filter: (c) => {
                    return c.name != 'Source Keeper'
                }
            });

        if(target){
            creep.memory.target = target.id;
            if(creep.attack(target) == ERR_NOT_IN_RANGE){
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
            }
        } else{
            creep.memory.target = 'none';
            creep.moveTo(creep.room.controller);
        }
    },
    run: function(creep, strat){
        if(strat == 'default'){
            this.defaultStrat(creep);
        } else if(strat == ''){

        }
	}
};

module.exports = soldierPool;