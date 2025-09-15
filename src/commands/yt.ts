import { Message, MessageMedia } from 'whatsapp-web.js';
import { Command, CommandContext } from '../whatsapp';
import { downloaderService } from '../services/downloader';
import config from '../config';
import logger from '../logger';
import yts from 'yt-search';

const ytCommand: Command = {
  name: 'yt',
  description: 'Lädt Audio von einem YouTube Video herunter (URL oder Suchbegriff).',
  async execute(message: Message, args: string[], context: CommandContext) {
    const query = args.join(' ');
    if (!query) {
      await message.reply('Bitte gib eine YouTube URL oder ein Suchbegriff ein.');
      return;
    }

    let videoUrl: string | undefined;

    // Check if the query is a valid YouTube URL
    if (query.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/)) {
      videoUrl = query;
    } else {
      // If not a URL, perform a search
      try {
        await message.reply(`Suche nach "${query}" auf YouTube...`);
        const searchResult = await yts(query);
        if (searchResult.videos.length > 0) {
          videoUrl = searchResult.videos[0].url;
        } else {
          await message.reply(`Keine Ergebnisse für "${query}" gefunden.`);
          return;
        }
      } catch (err) {
        logger.error(err, 'YouTube Suche fehlgeschlagen.');
        await message.reply('YouTube Suche fehlgeschlagen.');
        return;
      }
    }

    if (!videoUrl) {
        await message.reply('Kann keine Video zu Downloaden finden.');
        return;
    }

    let downloadResult;
    try {
      await message.reply('Starte Download... das kann ein Moment dauern.');
      downloadResult = await downloaderService.downloadYoutubeAudio(videoUrl, {
        maxSizeMb: config.MAX_FILE_SIZE_MB,
      });

      await message.reply(`🎵 Gefunden: ${downloadResult.title}`);
      
      const media = MessageMedia.fromFilePath(downloadResult.filePath);
      await message.reply(media, undefined, { sendMediaAsDocument: true });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      logger.error(error, 'Failed to process YouTube download.');
      await message.reply(`Error: ${errorMessage}`);
    } finally {
      if (downloadResult) {
        await downloadResult.cleanup();
      }
    }
  },
};

export default ytCommand;