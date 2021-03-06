module.exports = {
    name: 'delete',
    description: 'Supprime le nombre précisé de commentaires.',
    args: true,
    usage: '<nombre>',
    guildOnly: true,
    messageManagerOnly: true,
    cooldown: 1,
    execute(message, args) {
        const amount = parseInt(args[0]) + 1;

        if (isNaN(amount)) {
            return message.reply('Ça n\'a pas l\'air d\'être un nombre valide...');
        } else if (amount <= 1 || amount > 100) {
            return message.reply('Il faut préciser un nombre entre 1 et 99');
        }

        message.channel.bulkDelete(amount, true)
            .catch(err => {
            console.error(err);
            return message.channel.send('J\'ai rencontré une erreur en essayant de supprimer des messages sur ce chan...');
        });

        if(amount - 1 > 1) {
            return message.reply(`${amount - 1} messages supprimés !`)
                .then(sentMessage => {sentMessage.delete({timeout: 3000})});
        }else {
            return message.reply(`${amount - 1} message supprimé !`)
                .then(sentMessage => {sentMessage.delete({timeout: 3000})});
        }
    }
};