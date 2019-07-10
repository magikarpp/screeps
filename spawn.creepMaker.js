let util = require('util');

let creepMaker = {
    makeWorker: function(spawn){
        let arr = [];
        let num;
        if(util.getAllCreeps(spawn.room).length > 2){
            num = Math.floor((spawn.energyCapacity - 200) / 100);
        } else{
            num = 0;
        }

        for(let i = 0; i < num; i++){
            if(i % 2 == 1){
                arr.push(MOVE);
            } else{
                arr.push(WORK);
            }
        }
        arr.push(WORK);
        arr.push(CARRY);
        arr.push(MOVE);
    
        spawn.createCreep(arr, "Boi #" + Game.time,
            {
                role: 'harvester',
                type: 'worker',
                target: 'none',
                isWorking: false,
                source: 'none'
            });
        },
    makeSoldier: function(spawn){
        let arr = [];
        for(let i = 0; i < Math.floor((spawn.energyCapacity - 210) / 80 - 1); i++){
            if(i % 2 == 0){
                arr.push(MOVE);
            } else{
                arr.push(ATTACK);
            }
        }
        arr.push(ATTACK);
        arr.push(ATTACK);
        arr.push(MOVE);
    
        spawn.createCreep(arr, "Boi #" + Game.time,
            {
                role: 'solider',
                type: 'soldier',
                target: 'none',
                isWorking: false,
                squad: 0
            });
    }
}

module.exports = creepMaker;