const PlayerSheet = require('../models/playerSheet');
const use = require('./dependencies/items/_useSpecificItem');
/**
 * @class
 * @property {Number} id
 * @property {String} name
 * @property {Number} price
 * @property {String} description
 * @property {String} icon
 * @property {String} whenUsed
 */
const items = require('./dependencies/gameMarket').item;
const cd = require('./dependencies/_deleteTimer');
const expManager = require('./dependencies/_addExperience');
const maxExperience = 200;
const {experienceFormat} = require('../gameConfig');

function thisPlayerHasThisItem (player, itemName, materials = false, numberRequired = 0) {
    const inventory = !materials ? player.playerInventory : player.playerMaterials;
    if(!numberRequired){
        for(let i = 0; i < inventory.length; i++) {
            if(itemName === inventory[i]) {
                return true;
            }
        }
        return false;
    }else {
        let arrayOfMatchedElements = [];
        for(let j = 0; j < inventory.length; j++) {
            if(itemName === inventory[j]) {
                arrayOfMatchedElements.push(itemName);
            }
        }
        return arrayOfMatchedElements.length >= numberRequired;
    }
}

module.exports = {
    name: 'useitem',
    aliases: ['use'],
    description: "Permet d'utiliser un objet possédé",
    guildOnly: true,
    cooldown: 60 * 60,
    execute(message, args) {
        if(!args[0]) {
            cd.deleteTimer(message.author.id, this.name);
            return message.reply('Tu dois préciser quel objet tu veux utiliser !');
        }
        if(args.length > 1) {
            cd.deleteTimer(message.author.id, this.name);
            return message.reply("Tu ne peux utiliser qu'un seul objet à la fois !");
        }

        let itemToUse = args[0];

        PlayerSheet.findOne({playerId: message.author.id})
            .then(player => {
                    if(thisPlayerHasThisItem(player, itemToUse)) {
                        items.map(item => {
                            if(itemToUse === item.name) {
                                itemToUse = item;
                            }
                        });
                        player.playerInventory.splice(player.playerInventory.indexOf(itemToUse.name), 1);
                        const experience = expManager.addExperience(player, maxExperience, message);
                        player.save()
                            .then(() => {
                                return message.reply(`a utilisé un ${itemToUse.icon} \`${itemToUse.name}\` (\`+${experience}\` ${experienceFormat}) ! ${itemToUse.whenUsed}`)
                                    .then(() => {
                                        use.useSpecificItem(player, itemToUse.name, message);
                                    });
                            });
                    }else {
                        cd.deleteTimer(message.author.id, this.name);
                        return message.reply("Tu ne possèdes pas cet objet !");
                    }
                });
    },
    thisPlayerHasThisItem
};