require('dotenv').config();
const { Client, IntentsBitField, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField } = require('discord.js');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMembers,
  ],
});

const requiredHostRoleId = '1210720393036435517'; // Host Role ID
const sessionChannelId = '1332448542064640000'; // Session & Shift Channel ID
const moderationLogChannelId = 'YOUR_MODERATION_LOG_CHANNEL_ID'; // Moderation Log Channel ID
const trainingCenterLink = 'https://www.roblox.com/games/87762699340828/Training-Center'; // Training Center Link

client.on('ready', (c) => {
  console.log(`✅ ${c.user.tag} is online.`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const member = interaction.member;

  // Restrict commands to users with the Host role
  if (!member.roles.cache.has(requiredHostRoleId)) {
    return interaction.reply({ content: "❌ You do not have permission to use this command.", ephemeral: true });
  }

  // Training Session Command
  if (interaction.commandName === 'trainings') {
    const time = interaction.options.getString('time');

    const embed = new EmbedBuilder()
      .setColor('#2F3136')
      .setTitle('⏰ Training Commencement')
      .setDescription(`Greetings Haios, a training session is being hosted. If you are interested in ranking up to your next rank, please join us using the link provided below.\n\n📌 **Session Information:**\n**Time of Session:** ${time}\n**Session Host:** <@${interaction.user.id}>`)
      .setTimestamp();

    const button = new ButtonBuilder()
      .setLabel('Join Training Center')
      .setStyle(ButtonStyle.Link)
      .setURL(trainingCenterLink);

    const row = new ActionRowBuilder().addComponents(button);

    const sessionChannel = client.channels.cache.get(sessionChannelId);
    if (sessionChannel) {
      const msg = await sessionChannel.send({ content: '<@&1210720731625685062>', embeds: [embed], components: [row] });

      // Delete the message after 10 minutes
      setTimeout(() => msg.delete().catch(console.error), 600000);

      interaction.reply({ content: '✅ Training session has been announced.', ephemeral: true });
    } else {
      interaction.reply({ content: '❌ Error: Could not find the session channel.', ephemeral: true });
    }
  }

  // Shift Session Command
  if (interaction.commandName === 'shifts') {
    const time = interaction.options.getString('time');

    const embed = new EmbedBuilder()
      .setColor('#2F3136')
      .setTitle('🕒 Shift Commencement')
      .setDescription(`A shift session is starting! This is a great opportunity to work, earn promotions, and interact with other staff and customers.\n\n📌 **Session Information:**\n**Time of Session:** ${time}\n**Session Host:** <@${interaction.user.id}>`)
      .setTimestamp();

    const sessionChannel = client.channels.cache.get(sessionChannelId);
    if (sessionChannel) {
      const msg = await sessionChannel.send({ content: '<@&1210720731625685062>', embeds: [embed] });

      // Delete the message after 10 minutes
      setTimeout(() => msg.delete().catch(console.error), 600000);

      interaction.reply({ content: '✅ Shift session has been announced.', ephemeral: true });
    } else {
      interaction.reply({ content: '❌ Error: Could not find the session channel.', ephemeral: true });
    }
  }

  // Warn Command
  if (interaction.commandName === 'warn') {
    const targetUser = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (targetUser) {
      try {
        // DM the user the warning reason
        await targetUser.send(`🚨 **Warning from Haio Cafe** 🚨\n\nYou have been warned for the following reason:\n**Reason:** ${reason}\n\nPlease ensure to follow the rules to avoid further consequences.`);

        // Log the warning in the moderation log channel
        const logChannel = client.channels.cache.get(moderationLogChannelId);

        const warnEmbed = new EmbedBuilder()
          .setColor('#FFFF00')
          .setTitle('⚠️ User Warned')
          .setDescription(`User <@${targetUser.id}> has been warned.\n**Reason:** ${reason}`)
          .setTimestamp();

        if (logChannel) logChannel.send({ embeds: [warnEmbed] });

        interaction.reply({ content: `✅ User ${targetUser.tag} has been warned. They have been notified in DMs.`, ephemeral: true });
      } catch (err) {
        interaction.reply({ content: `❌ Error warning user: ${err.message}`, ephemeral: true });
      }
    }
  }

  // Ban Command
  if (interaction.commandName === 'ban') {
    const targetUser = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (targetUser) {
      try {
        await interaction.guild.members.ban(targetUser, { reason });
        const logChannel = client.channels.cache.get(moderationLogChannelId);

        const banEmbed = new EmbedBuilder()
          .setColor('#FF0000')
          .setTitle('🚫 User Banned')
          .setDescription(`User <@${targetUser.id}> has been banned.\n**Reason:** ${reason}`)
          .setTimestamp();

        if (logChannel) logChannel.send({ embeds: [banEmbed] });

        interaction.reply({ content: `✅ User ${targetUser.tag} has been banned.`, ephemeral: true });
      } catch (err) {
        interaction.reply({ content: `❌ Error banning user: ${err.message}`, ephemeral: true });
      }
    }
  }

  // Timeout Command
  if (interaction.commandName === 'timeout') {
    const targetUser = interaction.options.getUser('user');
    const duration = interaction.options.getInteger('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (targetUser) {
      try {
        await interaction.guild.members.timeout(targetUser, duration * 1000, reason);
        const logChannel = client.channels.cache.get(moderationLogChannelId);

        const timeoutEmbed = new EmbedBuilder()
          .setColor('#FFA500')
          .setTitle('⏳ User Timed Out')
          .setDescription(`User <@${targetUser.id}> has been timed out for ${duration} seconds.\n**Reason:** ${reason}`)
          .setTimestamp();

        if (logChannel) logChannel.send({ embeds: [timeoutEmbed] });

        interaction.reply({ content: `✅ User ${targetUser.tag} has been timed out for ${duration} seconds.`, ephemeral: true });
      } catch (err) {
        interaction.reply({ content: `❌ Error timing out user: ${err.message}`, ephemeral: true });
      }
    }
  }

  // Kick Command
  if (interaction.commandName === 'kick') {
    const targetUser = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (targetUser) {
      try {
        await interaction.guild.members.kick(targetUser, { reason });
        const logChannel = client.channels.cache.get(moderationLogChannelId);

        const kickEmbed = new EmbedBuilder()
          .setColor('#FF4500')
          .setTitle('👢 User Kicked')
          .setDescription(`User <@${targetUser.id}> has been kicked.\n**Reason:** ${reason}`)
          .setTimestamp();

        if (logChannel) logChannel.send({ embeds: [kickEmbed] });

        interaction.reply({ content: `✅ User ${targetUser.tag} has been kicked.`, ephemeral: true });
      } catch (err) {
        interaction.reply({ content: `❌ Error kicking user: ${err.message}`, ephemeral: true });
      }
    }
  }
});

client.login(process.env.TOKEN);
