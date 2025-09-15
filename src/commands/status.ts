import { Message } from 'whatsapp-web.js';
import { Command, CommandContext } from '../whatsapp';
import { getSystemInfo } from '../utils/systemInfo';
import config from '../config';

const statusCommand: Command = {
  name: 'status',
  description: 'Zeigt System und Bot Informationen.',
  async execute(message: Message, args: string[], context: CommandContext) {
    const info = getSystemInfo();

    const statusMessage = `
*${config.BOT_NAME} - System Status*

*Hostname*: ${info.hostname}
*OS*: ${info.os}
*CPU*: ${info.cpu} (${info.cpuCores} cores)
*RAM (Free/Total)*: ${info.freeRam} / ${info.totalRam}
*Uptime*: ${info.uptime}
*Node.js Version*: ${info.nodejsVersion}
    `.trim();

    await message.reply(statusMessage);
  },
};

export default statusCommand;