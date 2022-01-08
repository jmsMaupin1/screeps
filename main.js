let harvester = require('role.harvester');
let upgrader = require('role.upgrader');
let builder = require('role.builder');
let defender = require('role.defender');
let miner = require('role.miner');
let healer = require('role.healer');
let utils = require('utils');



module.exports.loop = function () {
    let roleCounts = {
        upgrader: 0,
        harvester: 0,
        builder: 0,
        miner: 0,
        healer: 0,
    }

    let roleMaxCounts = {
        harvester: 7,
        upgrader: 0,
        builder: 2,
        healer: 1,
    }

    let room = Game.rooms['E53S37'];
    let energySources = room.find(FIND_SOURCES);

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    for (let name in Game.creeps) {
        roleCounts[Game.creeps[name].memory.role] += 1
    }

    for (let role in roleCounts) {
        if (roleCounts[role] < roleMaxCounts[role]) {
            if (role == 'builder') {
                builder.spawn();
            } else if (role == 'healer') {
                const damagedStructures = room.find(FIND_STRUCTURES, {
                    filter: obj => obj.hits < obj.hitsMax
                });

                if (damagedStructures.length > 0) {
                    healer.spawn();
                } 
            } else {
                let name = role + '-' + Game.time;
                Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE, MOVE], name, {memory: {role}})
            }
        }
    }

    if (roleCounts.miner < energySources.length) {
        let creeps = Game.creeps;
        let sourcesBeingMined = [];

        for (let name in creeps) {
            let {role, source} = creeps[name].memory;
            if (role == 'miner')
                sourcesBeingMined.push(source);
        }

        sourcesNeedingMined = energySources.filter(function(source) {
            let alreadyBeingMined = sourcesBeingMined.indexOf(source.id) > -1;
            let container = utils.getSourceContainer(room, source)
            let hasContainer = container !== undefined && container.structure.store.energy < 2000;
            return !alreadyBeingMined && hasContainer;
        })
        
        for (let source of sourcesNeedingMined) {
            miner.spawn(source.id)
        }
    }

    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            harvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            upgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            builder.run(creep);
        }
        if(creep.memory.role == 'attacker') {
            defender.run(creep)
        }
        if(creep.memory.role === 'miner') {
            miner.run(creep);
        }
        if(creep.memory.role === 'healer') {
            healer.run(creep)
        }
    }
}

// Game.spawns['Spawn1'].spawnCreep([ATTACK, ATTACK, MOVE, MOVE], 'attacker-', {memory: {role: 'attacker'}})