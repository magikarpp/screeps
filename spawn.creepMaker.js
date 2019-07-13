let util = require('util');

let creepMaker = {
    makeWorker: function(spawn){
        let arr = [];
        let num = Math.floor(util.getExtensions(spawn.room).length / 2) + 1;

        console.log('EXTENSIONS: ' + Math.floor(util.getExtensions(spawn.room).length));

        for(let i = 1; i < num; i++){
            if(i % 3 == 0){
                arr.push(MOVE);
            } else{
                if(Math.floor(Math.random() * 2) == 0){
                    arr.push(CARRY);
                    arr.push(CARRY);
                }
                else arr.push(WORK);
            }
        }
        arr.push(WORK);
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