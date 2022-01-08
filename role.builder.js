let utils = require('utils');

let roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
        }

        if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
        }

        if (!creep.memory.building) {
            utils.harvest(creep);
        } else {
            if (creep.memory.source) {
                creep.memory.source = null;
            }
            this.build(creep);
        }
    },

    spawn: function() {
        Game.spawns['Spawn1'].spawnCreep(
            [WORK, CARRY, MOVE, MOVE],
            'builder-' + Game.time,
            {
                memory: {
                    role: 'builder',
                    building: false
                }
            }
        )
    },

    build: function(creep) {
        let targets = creep.room.find(FIND_CONSTRUCTION_SITES);

        if(targets.length) {
            if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            this.transfer(creep);
        }
    },

    transfer: function(creep) {
        let targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });

        if(targets.length > 0) {
            if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else  {
            this.upgrade(creep);
        }
    },

    upgrade: function(creep) {
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }

    
};

module.exports = roleBuilder;