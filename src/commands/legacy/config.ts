import { Message } from 'whatsapp-web.js';
import { Command, CommandContext } from '../../whatsapp';
import config from '../../config';

const configCommand: Command = {
  name: 'config',
  description: 'Zeigt die aktuelle Bot-Konfiguration an.',
  async execute(message: Message, args: string[], context: CommandContext) {
    // We create a copy to ensure we don't accidentally modify the running config.
    // If sensitive keys were present, they would be removed here.
    const safeConfig = { ...config };

    let configMessage = `*Current Bot Configuration*\\n\\n`;
    for (const [key, value] of Object.entries(safeConfig)) {
      configMessage += `*${key}*: \`\`\`${String(value)}\`\`\`\\n`;
    }

    await message.reply(configMessage.trim());
  },
};

export default configCommand;