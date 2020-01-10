const fs = require('fs');
const Discord = require('discord.js');
const {prefix} = require('./config.json');

const {token} = process.env.BOT_TOKEN || require('./auth.json');
const {adminID} = require('./auth.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const cooldowns = new Discord.Collection();


const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {

    client.user.setStatus('online')
        .then()
        .catch( error => {console.log('Erreur lors de l\'attribution du statut du bot : '+error)});
    client.user.setPresence({
        game: {
            name: 'conquérir le monde' }})
                .then()
                .catch( error => {console.log('Erreur lors de l\'attribution de l\' activité du bot : '+error)});

    console.log('botZilla is ready to go!');
    if(process.env.BOT_TOKEN) { console.log('Listening from heroku server.'); }
    else { console.log('Listening from local PC.'); }
});


// Create an event listener for new guild members
client.on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.find(ch => ch.name === 'discussion');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`Bienvenue sur le serveur de la Bobzilla Family, ${member} !`);
});



client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;



    const command = client.commands.get(commandName);

    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply('Je ne peux pas utiliser cette commande dans les messages privés !');
    }

    if (command.adminOnly && message.author.id !== adminID) {
        return message.reply('Désolé mais cette commande est réservée à l\'administration du bot.');
    }

    if (command.args && !args.length) {
        let reply = `Tu n'as précisé aucun argument, ${message.author}!`;

        if (command.usage) {
            reply += `\nLa bonne syntaxe est : \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {

        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`Merci d'attendre encore ${timeLeft.toFixed(1)} secondes avant d'utiliser la commande \`${command.name}\` de nouveau.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        try {
            command.execute(message, args);
            console.log(`Commande "${command.name}" réclamée par ${message.author.username} sur le serveur ${message.guild}.`);
        } catch (error) {
            console.error(error);
            console.log(`Commande "${command.name}" réclamée par ${message.author.username} sur le serveur ${message.guild}.`);
            return message.reply('Une erreur s\'est produite lors de l\'exécution de cette commande');
        }
});

client.login(process.env.BOT_TOKEN || token);