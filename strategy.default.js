let workerPool = require("workerPool");
let soldierPool = require("soldierPool");
let towerPool = require("towerPool");

let util = require("util");
let creepMaker = require("spawn.creepMaker");

let defaultStrategy = {
  run: function (room) {
    //Unit Statistics
    let harvesters = util.getHarvesters(room);
    let upgraders = util.getUpgraders(room);
    let builders = util.getBuilders(room);
    let helpers = util.getHelpers(room);

    let towers = util.getTowers(room);

    console.log("Harvesters: " + harvesters.length);
    console.log("Upgraders: " + upgraders.length);
    console.log(
      "Builders: " +
        builders.length +
        " (" +
        room.find(FIND_MY_CONSTRUCTION_SITES).length +
        ")"
    );
    console.log("Helpers: " + helpers.length);

    let soldiers = util.getSoldiers(room);
    let workers = harvesters.concat(upgraders).concat(builders).concat(helpers);
    let hostiles = util.getHostiles(room);

    let extensions = util.getExtensions(room);

    let spawners = _.filter(Game.spawns, (spawn) => spawn.room == room);

    let maxHarvestersLength =
      (room.memory.sources.length + 1) * (room.memory.scale + 1) -
      Math.floor(extensions.length / 10);

    let emergencyHarvesters = harvesters.length;
    let emergencyHelpers = helpers.length;

    //Creep Actions by Type
    for (let i in workers) {
      //Change roles to harvesters if we're running short
      if (
        harvesters.length < maxHarvestersLength - (room.memory.scale + 1) &&
        workers[i].role != "harvester" &&
        emergencyHarvesters < maxHarvestersLength - (room.memory.scale + 1)
      ) {
        if (workers[i].role == "upgrader") {
          workers[i].role = "harvester";
          workers[i].source = "none";
        }
        emergencyHarvesters = emergencyHarvesters++;
      }

      //Change roles to helper if we're running short
      if (
        helpers.length < towers.length &&
        workers[i].role == "upgrader" &&
        emergencyHelpers < towers.length
      ) {
        workers[i].role = "helper";
        workers[i].source = "none";
        emergencyHelpers = emergencyHelpers++;
      }

      workerPool.run(workers[i], "default");
    }

    for (let i in soldiers) {
      soldierPool.run(soldiers[i], "default");
    }

    for (let i in spawners) {
      let spawn = spawners[i];

      if (hostiles.length > 0) {
        room.memory.underAttack = true;
        if (soldiers.length < hostiles.length) {
          creepMaker.makeSoldier(spawn);
        }
        towerPool.defendRoom(room);
      } else {
        if (
          room.controller.level >= 3 &&
          soldiers.length <
            Math.floor(
              (workers.length + extensions.length) /
                (room.memory.scale * room.memory.scale)
            ) &&
          workers.length > room.memory.scale * 2
        ) {
          creepMaker.makeSoldier(spawn);
        }
        //Decide what role is needed and create worker
        let role;

        if (maxHarvestersLength < room.memory.sources.length + 1) {
          maxHarvestersLength = room.memory.sources.length + 1;
        }

        //Create role based on whats needed
        if (harvesters.length >= maxHarvestersLength) {
          if (helpers.length < towers.length) {
            role = "helper";
          } else if (
            room.controller.level >= 2 &&
            builders.length < room.memory.scale + 1 &&
            builders.length < room.find(FIND_MY_CONSTRUCTION_SITES).length
          ) {
            role = "builder";
          } else {
            role = "upgrader";
          }
        } else {
          role = "harvester";
        }

        room.memory.underAttack = false;
        creepMaker.makeWorker(spawn, role);
        towerPool.repairStructures(room);
      }

      //Spawner Visual
      if (spawn.spawning) {
        var spawningCreep = Game.creeps[spawn.spawning.name];
        spawn.room.visual.text(
          "Spawning: " + spawningCreep.memory.role,
          spawn.pos.x + 1,
          spawn.pos.y,
          { align: "left", opacity: 0.8 }
        );
      }
    }
  },
};

module.exports = defaultStrategy;
