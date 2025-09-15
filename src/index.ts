import { CottiWhatsAppBot, Command } from './whatsapp';
import config from './config';
import logger from './logger';
import readline from 'readline';

function startConsoleTestMode(bot: CottiWhatsAppBot) {
  logger.info('Starting in Console Test Mode...');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Manually load commands for test mode
  const commands = bot.getCommands();
  if (commands.size === 0) {
      logger.warn('Keine Befehle geladen. Stelle sicher, dass Befehle für Testmodus verfügbar sind.');
  }

  rl.setPrompt(`${config.PREFIX}> `);
  rl.prompt();

  rl.on('line', async (line) => {
    const input = line.trim();
    if (!input.startsWith(config.PREFIX)) {
      console.log('Ungültiger Befehl. Bitte mit dem Präfix beginnen.');
      rl.prompt();
      return;
    }

    const args = input.slice(config.PREFIX.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();

    if (!commandName) {
      rl.prompt();
      return;
    }

    const command = commands.get(commandName);

    if (command) {
      try {
        // Simulate a message object for the command
        const mockMessage: any = {
          body: input,
          reply: (text: string) => console.log(`[BOT REPLIED]: ${text}`),
          getChat: async () => ({ name: 'Console Test Chat' }),
          // Add other properties if your commands need them
        };

        // Create a mock context that satisfies the CommandContext interface for test mode
        const mockContext: any = {
            client: {},
            bot: {
                getCommands: () => commands
            }
        };

        await command.execute(mockMessage, args, mockContext);
      } catch (error) {
        logger.error(error, `Fehler beim Ausführen des Befehls: ${commandName}`);
      }
    } else {
      console.log('Unbekannter Befehl.');
    }

    rl.prompt();
  }).on('close', () => {
    logger.info('Console Test Mode beendet.');
    process.exit(0);
  });
}

async function main() {
  logger.info(`Starte ${config.BOT_NAME}...`);
  logger.debug({ config }, 'Aktuelle Konfiguration');

  const bot = new CottiWhatsAppBot();

  if (config.TEST_MODE) {
    // In test mode, we explicitly load commands and then start the console interface
    // without connecting to WhatsApp.
    await bot.loadCommands();
    startConsoleTestMode(bot);
  } else {
    // In normal mode, initialize() handles command loading and client connection.
    await bot.initialize();
  }
}

main().catch((err) => {
  logger.fatal(err, 'Bot konnte nicht gestartet werden');
  process.exit(1);
});
