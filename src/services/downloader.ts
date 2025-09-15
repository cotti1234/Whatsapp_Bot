import ytdl from '@distube/ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import logger from '../logger';
import config from '../config';

interface DownloadOptions {
  maxSizeMb: number;
}

interface DownloadResult {
  filePath: string;
  title: string;
  cleanup: () => Promise<void>;
}

export class DownloaderService {
  private tempDir: string;

  constructor() {
    this.tempDir = path.resolve(config.TEMP_DIR);
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
      logger.info(`Created temporary directory at: ${this.tempDir}`);
    }
    this.scheduleCleanup();
  }

  public async downloadYoutubeAudio(url: string, options: DownloadOptions): Promise<DownloadResult> {
    logger.info(`Starting download for YouTube URL: ${url}`);

    if (!ytdl.validateURL(url)) {
      throw new Error('Invalid YouTube URL provided.');
    }

    const info = await ytdl.getInfo(url);
    const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly' });

    if (!audioFormat) {
      throw new Error('No suitable audio format found.');
    }

    const fileSizeMb = parseInt(audioFormat.contentLength) / (1024 * 1024);
    if (fileSizeMb > options.maxSizeMb) {
      throw new Error(`File is too large (${fileSizeMb.toFixed(2)}MB). Max size is ${options.maxSizeMb}MB.`);
    }

    const title = info.videoDetails.title.replace(/[<>:"/\\|?*]+/g, ''); // Sanitize title
    const tempFilePath = path.join(this.tempDir, `${Date.now()}_${title}.mp3`);

    return new Promise((resolve, reject) => {
      const stream = ytdl.downloadFromInfo(info, { format: audioFormat });

      ffmpeg(stream)
        .audioBitrate(128)
        .toFormat('mp3')
        .on('end', () => {
          logger.info(`Erstellt: ${title}`);
          const result: DownloadResult = {
            filePath: tempFilePath,
            title,
            cleanup: async () => {
              try {
                await fs.promises.unlink(tempFilePath);
                logger.info(`Gelöscht: ${tempFilePath}`);
              } catch (err) {
                logger.error(err, `Fehler beim Löschen der Datei: ${tempFilePath}`);
              }
            },
          };
          resolve(result);
        })
        .on('error', (err) => {
          logger.error(err, 'Fehler bei der Konvertierung.');
          reject(new Error('Konvertierung fehlgeschlagen.'));
        })
        .save(tempFilePath);
    });
  }

  private scheduleCleanup() {
    // Clean up old files on startup and then every hour
    this.cleanupOldFiles();
    setInterval(() => this.cleanupOldFiles(), 60 * 60 * 1000);
  }

  private async cleanupOldFiles() {
    logger.info('Running scheduled cleanup of temporary files...');
    try {
      const files = await fs.promises.readdir(this.tempDir);
      const now = Date.now();
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours

      for (const file of files) {
        const filePath = path.join(this.tempDir, file);
        const stat = await fs.promises.stat(filePath);
        if (now - stat.mtime.getTime() > maxAge) {
          await fs.promises.unlink(filePath);
          logger.info(`Auto-cleaned old file: ${file}`);
        }
      }
    } catch (err) {
      logger.error(err, 'Fehler bei der automatischen Bereinigung.');
    }
  }
}

// Export a singleton instance
export const downloaderService = new DownloaderService();