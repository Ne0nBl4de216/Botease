import { Client, GatewayIntentBits, PermissionsBitField } from 'discord.js';
import { Bot } from '../models/Bot.js';

const activeBots = new Map();

export const setupBotManager = () => {
  Bot.find({}).then(bots => {
    bots.forEach(bot => {
      initializeBot(bot.token, bot.status);
    });
  });
};

export const deployBot = async (token, status) => {
  try {
    const client = await initializeBot(token, status);
    
    const bot = await Bot.create({
      token,
      status,
      commands: [
        { name: 'mute', enabled: true },
        { name: 'giveaway', enabled: true },
        { name: 'banip', enabled: true },
        { name: 'clear', enabled: true },
        { name: 'serverinfo', enabled: true }
      ]
    });

    activeBots.set(bot._id.toString(), client);
    return bot;
  } catch (error) {
    throw new Error('Failed to deploy bot: ' + error.message);
  }
};

export const updateBotStatus = async (botId, status) => {
  const bot = await Bot.findById(botId);
  if (!bot) throw new Error('Bot not found');

  const client = activeBots.get(botId);
  if (!client) throw new Error('Bot not active');

  if (status.online) client.user?.setStatus('online');
  if (status.dnd) client.user?.setStatus('dnd');
  if (status.invisible) client.user?.setStatus('invisible');
  if (status.streaming) {
    client.user?.setActivity('Streaming', { type: 'STREAMING' });
  }

  bot.status = status;
  await bot.save();
};

const initializeBot = async (token, status) => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildModeration
    ]
  });

  client.on('interactionCreate', handleCommands);

  await client.login(token);
  return client;
};

const handleCommands = async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;
  
  switch (commandName) {
    case 'mute':
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
        await interaction.reply('You do not have permission to mute members.');
        return;
      }
      const memberToMute = interaction.options.getMember('user');
      const duration = interaction.options.getInteger('duration') || 60;
      
      try {
        await memberToMute.timeout(duration * 1000, 'Muted by bot');
        await interaction.reply(`Muted ${memberToMute.user.tag} for ${duration} seconds`);
      } catch (error) {
        await interaction.reply('Failed to mute member');
      }
      break;

    case 'giveaway':
      const prize = interaction.options.getString('prize');
      const winners = interaction.options.getInteger('winners') || 1;
      const duration = interaction.options.getInteger('duration') || 60;

      const giveawayMessage = await interaction.reply({
        content: `🎉 GIVEAWAY 🎉\nPrize: ${prize}\nWinners: ${winners}\nEnds in: ${duration} seconds\nReact with 🎉 to participate!`,
        fetchReply: true
      });

      await giveawayMessage.react('🎉');
      
      setTimeout(async () => {
        const fetchedMessage = await interaction.channel.messages.fetch(giveawayMessage.id);
        const reaction = fetchedMessage.reactions.cache.get('🎉');
        const users = await reaction.users.fetch();
        const validParticipants = users.filter(user => !user.bot);

        if (validParticipants.size === 0) {
          await interaction.followUp('No valid participants for the giveaway.');
          return;
        }

        const winnersArray = validParticipants.random(Math.min(winners, validParticipants.size));
        await interaction.followUp(`Congratulations ${winnersArray.join(', ')}! You won: ${prize}`);
      }, duration * 1000);
      break;

    case 'banip':
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        await interaction.reply('You do not have permission to ban members.');
        return;
      }
      const ip = interaction.options.getString('ip');
      const reason = interaction.options.getString('reason') || 'No reason provided';
      
      try {
        await interaction.guild.bans.create(ip, { reason });
        await interaction.reply(`IP Address ${ip} has been banned. Reason: ${reason}`);
      } catch (error) {
        await interaction.reply('Failed to ban IP address');
      }
      break;

    case 'clear':
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
        await interaction.reply('You do not have permission to clear messages.');
        return;
      }
      const amount = interaction.options.getInteger('amount');
      
      try {
        await interaction.channel.bulkDelete(amount);
        await interaction.reply(`Cleared ${amount} messages`);
      } catch (error) {
        await interaction.reply('Failed to clear messages');
      }
      break;

    case 'serverinfo':
      const guild = interaction.guild;
      const embed = {
        color: 0x0099ff,
        title: guild.name,
        thumbnail: { url: guild.iconURL() },
        fields: [
          { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
          { name: 'Members', value: guild.memberCount.toString(), inline: true },
          { name: 'Created At', value: guild.createdAt.toDateString(), inline: true },
          { name: 'Boost Level', value: guild.premiumTier.toString(), inline: true },
          { name: 'Roles', value: guild.roles.cache.size.toString(), inline: true },
          { name: 'Channels', value: guild.channels.cache.size.toString(), inline: true }
        ],
        timestamp: new Date()
      };
      
      await interaction.reply({ embeds: [embed] });
      break;
  }
};