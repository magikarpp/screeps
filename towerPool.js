let util = require('util');

let tower = {
    defendRoom: function (room) {
        let hostiles = room.find(FIND_HOSTILE_CREEPS, {
                filter: (c) =>{
                    return c.room == room;
                }
            });
        if(hostiles.length > 0) {
            let towers = util.getTowers(room);
            towers.forEach(tower => tower.attack(hostiles[0]));
        }
    },
    repairStructures: function(room){
        let structures = util.getBrokenStructures(room);
        
        console.log("broken structures: " + structures.length);
        if(structures.length > 0){
            let towers = util.getTowers(room);
            towers.forEach(tower => tower.repair(structures[0]));
        }
    }
}

module.exports = tower;