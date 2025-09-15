import ytCommand from '../src/commands/yt';
import { Message, MessageMedia } from 'whatsapp-web.js';
import { CommandContext } from '../src/whatsapp';
import { downloaderService } from '../src/services/downloader';
import yts from 'yt-search';

// Mock external dependencies
jest.mock('yt-search');
jest.mock('../src/services/downloader');
jest.mock('whatsapp-web.js', () => ({
  ...jest.requireActual('whatsapp-web.js'), // import and retain default behavior
  MessageMedia: {
    fromFilePath: jest.fn(),
  },
}));

describe('YT Command', () => {
  const mockReply = jest.fn();
  const mockMessage = { reply: mockReply } as unknown as Message;
  const mockContext = {} as CommandContext;

  beforeEach(() => {
    // Clear mocks before each test
    mockReply.mockClear();
    (yts as unknown as jest.Mock).mockClear();
    (downloaderService.downloadYoutubeAudio as jest.Mock).mockClear();
    (MessageMedia.fromFilePath as jest.Mock).mockClear();
  });

  it('should download audio when a valid YouTube URL is provided', async () => {
    const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    const mockDownloadResult = {
      filePath: '/temp/fake_song.mp3',
      title: 'Never Gonna Give You Up',
      cleanup: jest.fn().mockResolvedValue(undefined),
    };
    (downloaderService.downloadYoutubeAudio as jest.Mock).mockResolvedValue(mockDownloadResult);

    await ytCommand.execute(mockMessage, [url], mockContext);

    expect(downloaderService.downloadYoutubeAudio).toHaveBeenCalledWith(url, expect.any(Object));
    expect(mockReply).toHaveBeenCalledWith('Starte Download... das kann ein Moment dauern.');
    expect(mockReply).toHaveBeenCalledWith('🎵 Gefunden: Never Gonna Give You Up');
    expect(MessageMedia.fromFilePath).toHaveBeenCalledWith('/temp/fake_song.mp3');
    expect(mockDownloadResult.cleanup).toHaveBeenCalled();
  });

  it('should search for a video and download the first result', async () => {
    const searchTerm = 'rick astley';
    const searchResult = {
      videos: [{ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }],
    };
    (yts as unknown as jest.Mock).mockResolvedValue(searchResult);

    const mockDownloadResult = {
      filePath: '/temp/fake_song.mp3',
      title: 'Never Gonna Give You Up',
      cleanup: jest.fn().mockResolvedValue(undefined),
    };
    (downloaderService.downloadYoutubeAudio as jest.Mock).mockResolvedValue(mockDownloadResult);

    await ytCommand.execute(mockMessage, [searchTerm], mockContext);

    expect(yts).toHaveBeenCalledWith(searchTerm);
    expect(mockReply).toHaveBeenCalledWith(`Suche nach "${searchTerm}" auf YouTube...`);
    expect(downloaderService.downloadYoutubeAudio).toHaveBeenCalledWith(searchResult.videos[0].url, expect.any(Object));
    expect(mockDownloadResult.cleanup).toHaveBeenCalled();
  });

  it('should handle download failures gracefully', async () => {
    const url = 'https://www.youtube.com/watch?v=fail';
    const error = new Error('Test download error');
    (downloaderService.downloadYoutubeAudio as jest.Mock).mockRejectedValue(error);

    await ytCommand.execute(mockMessage, [url], mockContext);

    expect(mockReply).toHaveBeenCalledWith('Error: Test download error');
  });
});
