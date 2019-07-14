let defaultStrategy = require('strategy.default');
let util = require('util');

module.exports.loop = function (){
    //Init
    Memory.roadTrigger = true;
    
    if(!Memory.strategy){
        Memory.strategy = 'default';
    }

    //Change every room's strategy on change of strategy
    if(Memory.strategy != Memory.previousStrategy){
        for(let name in Game.rooms){
            Game.rooms[name].memory.strategy = Memory.strategy;
        }
        Memory.previousStrategy = Memory.strategy;
    }

    console.log('------------------------');

    //Room-focused algorithm
    for(let name in Game.rooms){
        let room = Game.rooms[name];

        //Init room memory
        if(!room.memory.sources){
            let sources = [];
            for(let i in room.find(FIND_SOURCES)){
                sources[i] = room.find(FIND_SOURCES)[i].id;
            }
            room.memory.sources = sources;
        }
        if(!room.memory.scale){
            room.memory.scale = 3;
            room.memory.strategy = 'default';
        }

        console.log('\n"' + name + '" Room has ' + room.energyAvailable + ' energy');
        console.log('Room Scale: ' + room.memory.scale);
        console.log('Room Strategy: ' + room.memory.strategy);

        if(room.memory.strategy == 'default'){
            defaultStrategy.run(room);
        } else if(room.memory.strategy == ''){

        }
    }

    //Console Display Aid
    console.log('\nTotal Workers: ' + _.filter(Game.creeps, (creep) => true).length);
    console.log('Total Soldiers: ' + _.filter(Game.creeps, (creep) => creep.memory.role == 'soldier').length);
    console.log('Overall Strategy: ' + Memory.strategy);
}