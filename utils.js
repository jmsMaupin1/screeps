var utils = {
    getOpenMiningSpots: function(room, targets, creep=null) {
        let terrain = room.getTerrain(),
            neighbors = [
                {x:-1, y:-1}, {x: 0, y:-1}, {x: 1, y:-1},
                {x:-1, y: 0},               {x: 1, y: 0},
                {x:-1, y: 1}, {x: 0, y: 1}, {x: 1, y: 1}
            ],
            availableSources = [];
        
        for (let source of targets) {
            let walkableTerrain = []
            for (let neighbor of neighbors) {
                let tilePos = {x: source.pos.x + neighbor.x, y: source.pos.y + neighbor.y}
                let tile = terrain.get(tilePos.x, tilePos.y);
                let lookedAt = room.lookAt(tilePos.x, tilePos.y).filter(function(tile) {
                    if (creep)
                        return tile.type == 'creep' && tile.creep.id !== creep.id
                    
                    return tile.type == 'creep';
                });
    
                if (lookedAt.length) {
                    continue;
                }
    
                if (tile === 2 || tile === 0) {
                    walkableTerrain.push(tilePos)
                }
            }
            if (walkableTerrain.length > 0) {
                source['walkableTerrain'] = walkableTerrain;
                availableSources.push(source);
            }
        }
    
        return availableSources;
    },

    findClosestAvailableSource: function(creep) {
        let source = creep.room.find(FIND_SOURCES),
            containers = creep.room.find(FIND_STRUCTURES, {
                filter: structure => {
                    return (
                        structure.structureType == 'container' &&
                        structure.store.energy > 0
                    )
                }
            }),
            sources = utils.getOpenMiningSpots(creep.room, source.concat(containers), creep);
            roomPositions = [];
        
        if (sources.length === 0) return null;
        else if (sources.length === 1) return sources[0].id;
        else return creep.pos.findClosestByPath(sources).id;
    },

    getSourceContainer: function(room, source) {
        let neighbors = [
            {x:-1, y:-1}, {x: 0, y:-1}, {x: 1, y:-1},
            {x:-1, y: 0},               {x: 1, y: 0},
            {x:-1, y: 1}, {x: 0, y: 1}, {x: 1, y: 1}
        ],
        container = null;

        for (let neighbor of neighbors) {
            let tile = room.lookAt(source.pos.x + neighbor.x, source.pos.y + neighbor.y);
            tile = tile.filter(function(obj) {
                let {type, structure} = obj;
                return type == 'structure' && structure.structureType === 'container';
            })

            if (tile.length > 0) {
                return tile[0]
            }
        }

    },

    harvest: function(creep) {
        if (creep.memory.source) {
            let memorySource = Game.getObjectById(creep.memory.source);
            let availableSources = utils.getOpenMiningSpots(creep.room, [memorySource], creep);

            if (availableSources.length > 0) {
                let freeTiles = availableSources[0].walkableTerrain.map(function(t) {return new RoomPosition(t.x, t.y, creep.room.name)});
                let targetTile = null;
                if (freeTiles.length > 1){
                   targetTile = creep.pos.findClosestByPath(freeTiles)
                } else {
                    targetTile = freeTiles[0];
                }

                if(creep.harvest(Game.getObjectById(creep.memory.source)) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetTile, {visualizePathStyle: {stroke: '#ffaa00'}});
                } else if (creep.withdraw(Game.getObjectById(creep.memory.source), RESOURCE_ENERGY, creep.store.getFreeCapacity()) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetTile, {visualizePathStyle: {stroke: '#ffaa00'}})

                }
                    
            } else {
                creep.say('availSources.len === 0')
                creep.memory.source = null;
            }
        } else {
            let findClosestAvail = utils.findClosestAvailableSource(creep);
            creep.memory.source = findClosestAvail;
        }
    },
}

module.exports = utils;