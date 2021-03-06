const PlayerSheet = require('../models/playerSheet');
const {prefix} = require('../config');
const {currency} = require('../config');
const cd = require('./dependencies/_deleteTimer');

module.exports = {
    name: 'money',
    description: `Renseigne un joueur sur le nombre de ${currency} dont il dispose.`,
    cooldown: 60,
    execute(message) {
        PlayerSheet.findOne({playerId: message.author.id})
            .then(player => {
                if(!player)
                {
                    cd.deleteTimer(message.author.id, this.name);
                    return message.reply(`Merci de commencer par créer ta fiche avec la commande ${prefix}fiche !`)
                }

                return message.reply(`possède actuellement \`${player.playerPurse} ${currency}\` !`);
            })
    }
};