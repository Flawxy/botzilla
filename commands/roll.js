const random = require('./dependencies/_getRandomInt.js');

module.exports = {
    name: 'roll',
    aliases: ['rl'],
    description: 'Jette un dé du nombre de faces demandées (ou un dé 6 par défaut).',
    usage: '<nombre de faces> ou <xdy> avec x le nombre de dé(s) et y le nombre de face par dé',
    cooldown: 0,
    execute(message, args) {
        if(args[0] && (args[0].includes("d") || args[0].includes("D"))) {
            const syntax = args[0].includes("d") ? args[0].split("d") : args[0].split("D");
            const diceNumber = parseInt(syntax[0], 10);
            const faceNumber = parseInt(syntax[1], 10);
            let sum = 0;

            if(isNaN(diceNumber) || isNaN(faceNumber)) {
                return message.channel.send(`Désolé mais je n'ai pas reconnu la syntaxe \`${args[0]}\`...`);
            }
            for(let i = 0; i < diceNumber; i++) {
                let randomResult = random.getRandomInt(faceNumber) + 1;
                message.author.send(`jette un dé ${faceNumber} et obtient \`${randomResult}\``)
                    .catch(console.error);
                sum += randomResult;
            }
            return message.reply(`Somme du lancer de ${diceNumber} dé${diceNumber > 1 ? 's' : ''} à ${faceNumber} face${faceNumber > 1 ? 's' : ''} : ${sum}`);

        }else if(args[0] && isNaN(args[0])) {
            return message.channel.send(`Désolé mais "${args[0]}" n'est pas un nombre...`);
        }
        if(parseInt(args[0], 10) === 0) return message.channel.send(`Impossible de lancer un dé avec un nombre de face nul !`);
        if(!args[0]) args[0] = 6;

        return message.reply(`jette un dé ${args[0]} et obtient \`${random.getRandomInt(args[0]) + 1}\``);
    }
};