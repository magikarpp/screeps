let defaultStrategy = require('strategy.default');

module.exports.loop = function (){
    //Init Strategy
    if(!Memory.strategy){
        Memory.strategy = 'default';
        Memory.scale = 2;
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

        //Init Sources Id
        if(!room.memory.sources){
            let sources = [];
            for(let i in room.find(FIND_SOURCES)){
                console.log(room.find(FIND_SOURCES)[i].id);
                sources[i] = room.find(FIND_SOURCES)[i].id;
            }
            room.memory.sources = sources;
        }

        console.log('\n"' + name + '" Room has ' + room.energyAvailable + ' energy');
        console.log('Room Strategy: ' + room.memory.strategy);

        if(room.memory.strategy == 'default'){
            defaultStrategy.run(room);
        } else if(room.memory.strategy == ''){

        }
    }

    //Console Display Aid
    let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    console.log('\nTotal Harvesters: ' + harvesters.length);
    let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    console.log('Total Upgraders: ' + upgraders.length);
    let builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    console.log('Total Builders: ' + builders.length);
    console.log('Overall Strategy: ' + Memory.strategy);
}