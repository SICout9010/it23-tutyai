import { Client, Events, GatewayIntentBits, Collection, REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import * as verify from './commands/verify';

dotenv.config();

const token = process.env.DISCORD_TOKEN;
const guildId = process.env.DISCORD_GUILD_ID;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
}) as Client<boolean> & { commands: Collection<string, any> };
client.commands = new Collection();

client.commands.set(verify.data.name, verify);

client.once(Events.ClientReady, async c => {
    console.log(`Logged in as ${c.user.tag}!`);
    if (!guildId) {
        console.error('DISCORD_GUILD_ID missing');
        return;
    }
    const rest = new REST().setToken(token!);
    try {
        console.log('Refreshing commands');
        await rest.put(
            Routes.applicationGuildCommands(c.user.id, guildId),
            { body: client.commands.map(cmd => cmd.data) }
        );
        console.log('Commands refreshed');
    } catch (error) {
        console.error(error);
    }
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.on(Events.MessageCreate, msg => {
    if (msg.content === '!ping') {
        msg.reply('บ่นไร');
    }
});

client.login(token);