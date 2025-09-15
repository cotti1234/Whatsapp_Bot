import pingCommand from '../src/commands/ping';
import { Message } from 'whatsapp-web.js';
import { CommandContext } from '../src/whatsapp';

describe('Ping Command', () => {
  it('should reply with Pong! and a calculated latency', async () => {
    // Mock the message object
    const mockMessage = {
      reply: jest.fn(),
      timestamp: Math.floor(Date.now() / 1000) - 2, // Simulate a message sent 2 seconds ago
    } as unknown as Message;

    // Mock the context object
    const mockContext = {} as CommandContext;

    await pingCommand.execute(mockMessage, [], mockContext);

    // Check if reply was called
    expect(mockMessage.reply).toHaveBeenCalledTimes(1);

    // Check the content of the reply
    const replyArgument = (mockMessage.reply as jest.Mock).mock.calls[0][0];
    expect(replyArgument).toMatch(/🏓 Pong! Latency: \d+ms/);
  });
});
