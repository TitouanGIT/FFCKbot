const fs = require('node:fs');
const path = require('node:path');
const { Client, Intents, MessageActionRow, MessageSelectMenu, GatewayIntentBits, Collection, Events, PermissionsBitField } = require('discord.js');
const client = new Client( {intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages]} );
const { token } = require('./config.json');
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));


client.commands = new Collection();

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}
client.on(Events.InteractionCreate, interaction => {
  if (!interaction.isChatInputCommand()) return;
	console.log(interaction);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`La commande " ${interaction.commandName} "n'a pas étais trouvé.`);
		return;
	}

	try {
		if (interaction.member.permissions.has([PermissionsBitField.Flags.BanMembers])) {
		await command.execute(interaction);
		}
		else{
			await interaction.reply({ content: `Tu n'a pas le droit d'utiliser les commandes`, ephemeral: true });
		}
		
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: "Une erreur s'est produis lors de l'execution de la commande!", ephemeral: true });
		} else {
			await interaction.reply({ content: "Une erreur s'est produis lors de l'execution de la commande!", ephemeral: true });
		}
	}
});

client.on('ready', () => {
  console.log(`Le bot ${client.user.tag} a bien étais connecté!`);
});
   
  client.login(token); 