var roleDefender = {

    /** @param {Creep} creep **/
    run: function(creep) {
        let foes = creep.room.find(FIND_HOSTILE_CREEPS);
        if(creep.attack(foes[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(foes[0])
        }
    }
};

module.exports = roleDefender;