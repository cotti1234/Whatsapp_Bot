import configCommand from '../src/commands/legacy/config';
import { Message } from 'whatsapp-web.js';
import { CommandContext } from '../src/whatsapp';
import config from '../src/config';

// Mock the config module
jest.mock('../src/config', () => ({
  __esModule: true, // This is important for ES modules
  default: {
    BOT_NAME: 'Test Bot',
    PREFIX: '$',
    NODE_ENV: 'test',
  },
}));

describe('Config Command', () => {
  it('zeigt die aktuelle Bot-Konfiguration an', async () => {
    const mockMessage = {
      reply: jest.fn(),
    } as unknown as Message;

    const mockContext = {} as CommandContext;

    await configCommand.execute(mockMessage, [], mockContext);

    expect(mockMessage.reply).toHaveBeenCalledTimes(1);
    const reply = (mockMessage.reply as jest.Mock).mock.calls[0][0];

    // Check if the reply contains the mocked config values
    expect(reply).toContain('*BOT_NAME*: ```Test Bot```');
    expect(reply).toContain('*PREFIX*: ```$```');
    expect(reply).toContain('*NODE_ENV*: ```test```');
  });
});
