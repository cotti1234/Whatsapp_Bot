import helpCommand from '../src/commands/help';
import { Message } from 'whatsapp-web.js';
import { Command, CommandContext } from '../src/whatsapp';

describe('Help Command', () => {
  it('should list all available commands with their descriptions', async () => {
    // Create a map of mock commands
    const mockCommands = new Map<string, Command>();
    mockCommands.set('ping', { name: 'ping', description: 'Checks latency.', execute: jest.fn() });
    mockCommands.set('status', { name: 'status', description: 'Shows system info.', execute: jest.fn() });
    mockCommands.set('help', { name: 'help', description: 'Lists all commands.', execute: jest.fn() });

    const mockMessage = {
      reply: jest.fn(),
    } as unknown as Message;

    // Mock the context to provide the command map
    const mockContext = {
      bot: {
        getCommands: () => mockCommands,
      },
    } as unknown as CommandContext;

    await helpCommand.execute(mockMessage, [], mockContext);

    expect(mockMessage.reply).toHaveBeenCalledTimes(1);
    const reply = (mockMessage.reply as jest.Mock).mock.calls[0][0];

    // Check if the reply contains the details of our mock commands
    expect(reply).toContain('*!ping*: Checks latency.');
    expect(reply).toContain('*!status*: Shows system info.');
    expect(reply).toContain('*!help*: Lists all commands.');
  });
});
