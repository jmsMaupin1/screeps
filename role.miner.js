let utils = require('utils');
// This should only go mine not carry around or move. It will drop the energy
// mined into a container. So It should only ever sit on top of a container.
var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.source && !creep.memory.container) {
            let sourceObj = Game.getObjectById(creep.memory.source);
            let container = utils.getSourceContainer(creep.room, sourceObj);

            if (container) {
                creep.memory.container = container.structure.id;
            }
        } else if (creep.memory.source && creep.memory.container) {
            this.mine(creep);
        }
    },

    spawn: function(source) {
        Game.spawns['Spawn1'].spawnCreep(
            [WORK, WORK, WORK, MOVE, MOVE, MOVE],
            'Miner-' + Game.time,
            {
                memory:{
                    role: 'miner',
                    source
                }
            }
        )
    },

    mine: function(creep) {
        let sourceObj = Game.getObjectById(creep.memory.source);
        let containerObj = Game.getObjectById(creep.memory.container);

        if(!(creep.pos.x == containerObj.pos.x && creep.pos.y == containerObj.pos.y)) {
            creep.moveTo(containerObj, {visualizePathStyle: {stroke: '#ffaa00'}});
        } else if (containerObj.store.energy < containerObj.storeCapacity){
            creep.harvest(sourceObj);
        }
    }
};

module.exports = roleMiner;