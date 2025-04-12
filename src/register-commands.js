require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

const commands = [
  {
    name: 'trainings',
    description: 'Announce a training session.',
    options: [
      {
        name: 'time',
        description: 'Enter the time of the training session.',
        type: ApplicationCommandOptionType.String,
        required: true,
      }
    ]
  },
  {
    name: 'shifts',
    description: 'Announce a shift session.',
    options: [
      {
        name: 'time',
        description: 'Enter the time of the shift session.',
        type: ApplicationCommandOptionType.String,
        required: true,
      }
    ]
  },
  {
    name: 'warn',
    description: 'Warn a user and notify them in DMs.',
    options: [
      {
        name: 'user',
        description: 'The user to warn.',
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: 'reason',
        description: 'The reason for warning the user.',
        type: ApplicationCommandOptionType.String,
        required: false,
      }
    ]
  },
  {
    name: 'ban',
    description: 'Ban a user from the server.',
    options: [
      {
        name: 'user',
        description: 'The user to ban.',
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: 'reason',
        description: 'The reason for banning the user.',
        type: ApplicationCommandOptionType.String,
        required: false,
      }
    ]
  },
  {
    name: 'timeout',
    description: 'Timeout a user for a certain duration.',
    options: [
      {
        name: 'user',
        description: 'The user to timeout.',
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: 'duration',
        description: 'The duration of the timeout in seconds.',
        type: ApplicationCommandOptionType.Integer,
        required: true,
      },
      {
        name: 'reason',
        description: 'The reason for timing out the user.',
        type: ApplicationCommandOptionType.String,
        required: false,
      }
    ]
  },
  {
    name: 'kick',
    description: 'Kick a user from the server.',
    options: [
      {
        name: 'user',
        description: 'The user to kick.',
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: 'reason',
        description: 'The reason for kicking the user.',
        type: ApplicationCommandOptionType.String,
        required: false,
      }
    ]
  }
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('📢 Registering slash commands...');

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log('✅ Slash commands registered successfully!');
  } catch (error) {
    console.log(`❌ There was an error: ${error}`);
  }
})();
