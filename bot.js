const Discord = require('discord.js');
const bot = new Discord.Client();
const welcomeMessageAndStreamNotificationChannel = 'discussion';
const salesChannel = 'botzilla';
const adminChannelName = 'botzilla-admin';
const roleToMention = 'Infos';

// Bot connexion
const login = require('./bot/login');
login(bot);
// DB connexion
const dbConnect = require('./bot/dbConnect');
dbConnect();
// Sets the bot's presence (status + game played) once its connected
const onceReady = require('./bot/events/onceReady');
onceReady(bot);
// Sets the bot behaviour when a new member joins the Discord server
const newMember = require('./bot/events/onGuildMemberAdd');
newMember(bot, welcomeMessageAndStreamNotificationChannel);
// Sets the bot behaviour for specified messages
const onMessage = require('./bot/events/onMessage');
onMessage(bot);

/* -------------------- 🢃 AUTOMATED FUNCTIONS 🢃 -------------------- */
// Displays a @here message when Bobz starts streaming
const streamStarting = require('./bot/automated/streamStarting');
streamStarting(bot, 60, welcomeMessageAndStreamNotificationChannel);
// Displays a @everyone message when new EGS deals are available
const egsFetcher = require('./bot/automated/egsFetcher');
egsFetcher(bot, 10, salesChannel, roleToMention);
// Displays @everyone message when new Steam deals are available
const steamFetcher = require('./bot/automated/steamFetcher');
steamFetcher(bot, 10, salesChannel, adminChannelName, roleToMention);