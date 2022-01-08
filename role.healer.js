var utils = require('utils');

var roleHealer = {

    /** @param {Creep} creep **/
    run: function(creep) {
       if (creep.memory.healing && creep.store[RESOURCE_ENERGY] == 0) {
           creep.memory.healing = false;
       }

       if (!creep.memory.healing && creep.store.getFreeCapacity() == 0) {
           creep.memory.healing = true;
       }

       if (creep.memory.healing) {
            if (creep.memory.source) {
                creep.memory.source = null;
            }
            if (creep.memory.repairTarget) {
                this.heal(creep);
            } else {
                this.findTarget(creep);
            }
       } else {
           utils.harvest(creep);
       }
    },

    spawn: function() {
        Game.spawns['Spawn1'].spawnCreep(
            [WORK, CARRY, MOVE, MOVE],
            'healer-' + Game.time,
            {
                memory: {
                    role: 'healer',
                    healing: false
                }
            }
        )
    },

    findTarget: function(creep) {
        const targets = creep.room.find(FIND_STRUCTURES, {
            filter: obj => obj.hits < obj.hitsMax
        });

        targets.sort((a,b) => a.hits - b.hits);

        if (targets.length > 0) {
            creep.memory.repairTarget = targets[0].id;
        }
    },

    heal: function(creep) {
        let target = Game.getObjectById(creep.memory.repairTarget);

        if (target.hits < target.hitsMax) {
            if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        } else {
            creep.memory.repairTarget = null;
        }
    },
};

module.exports = roleHealer;