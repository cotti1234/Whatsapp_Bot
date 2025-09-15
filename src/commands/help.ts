import { Message } from 'whatsapp-web.js';
import { Command, CommandContext } from '../whatsapp';
import config from '../config';

const helpCommand: Command = {
  name: 'help',
  description: 'Listet alle verfügbaren Befehle auf.',
  async execute(message: Message, args: string[], context: CommandContext) {
    const commands = context.bot.getCommands();
    let helpMessage = `*${config.BOT_NAME} - Verfügbare Befehle*\n\n`;

    commands.forEach((command) => {
      if (command.description) { // Only show commands with a description
        helpMessage += `*${config.PREFIX}${command.name}*: ${command.description}\n`;
      }
    });

    await message.reply(helpMessage.trim());
  },
};

export default helpCommand;
