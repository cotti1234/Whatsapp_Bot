import { Message } from 'whatsapp-web.js';
import { Command, CommandContext } from '../whatsapp';

const pingCommand: Command = {
  name: 'ping',
  description: 'Misst die Reaktionszeit des Bots.',
  async execute(message: Message, args: string[], context: CommandContext) {
    const startTime = Date.now();
    // The 'timestamp' property on the message is when the message was sent.
    // We can compare it to the current time to get the latency.
    // Note: This requires the client's and server's clocks to be somewhat synchronized.
    const messageTimestamp = message.timestamp * 1000; // a-w.js timestamp is in seconds
    const latency = startTime - messageTimestamp;

    await message.reply(`🏓 Pong! Latency: ${latency}ms`);
  },
};

export default pingCommand;
