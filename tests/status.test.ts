import statusCommand from '../src/commands/status';
import { Message } from 'whatsapp-web.js';
import { CommandContext } from '../src/whatsapp';
import * as systemInfo from '../src/utils/systemInfo';

// Mock the getSystemInfo utility
jest.mock('../src/utils/systemInfo', () => ({
  getSystemInfo: jest.fn(),
}));

describe('Status Command', () => {
  it('should reply with formatted system information', async () => {
    // Provide mock data for our mocked function
    const mockInfo: systemInfo.SystemInfo = {
      hostname: 'TestHost',
      os: 'TestOS 1.0 (x64)',
      cpu: 'Test CPU @ 3.00GHz',
      cpuCores: 4,
      totalRam: '16.00 GB',
      freeRam: '8.00 GB',
      uptime: '1d 2h 3m 4s',
      nodejsVersion: 'v18.0.0',
    };
    (systemInfo.getSystemInfo as jest.Mock).mockReturnValue(mockInfo);

    const mockMessage = {
      reply: jest.fn(),
    } as unknown as Message;

    const mockContext = {} as CommandContext;

    await statusCommand.execute(mockMessage, [], mockContext);

    expect(mockMessage.reply).toHaveBeenCalledTimes(1);
    const reply = (mockMessage.reply as jest.Mock).mock.calls[0][0];

    // Check if the reply contains all the mock data
    expect(reply).toContain('*Hostname*: TestHost');
    expect(reply).toContain('*OS*: TestOS 1.0 (x64)');
    expect(reply).toContain('*CPU*: Test CPU @ 3.00GHz (4 cores)');
    expect(reply).toContain('*RAM (Free/Total)*: 8.00 GB / 16.00 GB');
    expect(reply).toContain('*Uptime*: 1d 2h 3m 4s');
    expect(reply).toContain('*Node.js Version*: v18.0.0');
  });
});
