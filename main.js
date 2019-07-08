let defaultStrategy = require('strategy.default');

module.exports.loop = function (){
    //Init default strategy
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

    //Room-focused algorithm
    for(let name in Game.rooms){
        let room = Game.rooms[name];

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
    let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgraders');
    console.log('Total Upgraders: ' + upgraders.length);
    let builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builders');
    console.log('Total Builders: ' + builders.length);
    console.log('Overall Strategy: ' + Memory.strategy);
    console.log('Game.cpu.limit: ' + Game.cpu.limit);
    console.log('Game.cpu.tickLimit: ' + Game.cpu.tickLimit);
}