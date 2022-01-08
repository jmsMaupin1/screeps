let utils = require('utils');

// do we even need upgraders if harvesters will basically
// be upgraders if nothing else needs energy?
var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.store.getFreeCapacity() > 0) {
            utils.harvest(creep)
        } else {
            if (creep.memory.source) {
                creep.memory.source = null;
            }
            this.upgrade(creep);
        }
    },

    upgrade: function(creep) {
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }

    
};

module.exports = roleUpgrader;