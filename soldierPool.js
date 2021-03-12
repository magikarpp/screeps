let soldierPool = {
  defaultStrat: function (creep) {
    let target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

    if (target) {
      creep.memory.target = target.id;
      if (creep.attack(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, { visualizePathStyle: { stroke: "#ff0000" } });
      }
    }
  },
  run: function (creep, strat) {
    if (strat == "default") {
      this.defaultStrat(creep);
    } else if (strat == "") {
    }
  },
};

module.exports = soldierPool;
