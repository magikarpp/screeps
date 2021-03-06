let roads = {
  dropRoad: function (creep) {
    if (creep.room.controller.level >= 2) {
      creep.say("Road Here.", false);
      creep.room.createConstructionSite(creep, STRUCTURE_ROAD);
    }
  },
  needsRoad: function (creep) {
    let objects = creep.room.lookAt(creep);
    let res = objects.find((o) => {
      return (
        (o.type == LOOK_CONSTRUCTION_SITES &&
          o.constructionSite.structureType == STRUCTURE_ROAD) ||
        (o.type == LOOK_STRUCTURES &&
          o.structure.structureType == STRUCTURE_ROAD)
      );
    });

    return res == undefined;
  },
};

module.exports = roads;
