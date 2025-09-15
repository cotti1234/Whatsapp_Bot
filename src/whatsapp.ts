import { Client, LocalAuth, Message } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import fs from 'fs';
import path from 'path';
import logger from './logger';
import config from './config';

export interface CommandContext {
  client: Client;
  bot: CottiWhatsAppBot;
}

export interface Command {
  name: string;
  description: string;
  execute(message: Message, args: string[], context: CommandContext): Promise<void>;
}

export class CottiWhatsAppBot {
  private client: Client;
  private commands: Map<string, Command> = new Map();

  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    });

    this.initializeEventListeners();
  }

  public async initialize() {
    logger.info('WhatsApp Client wird initialisiert...');
    await this.loadCommands();
    this.client.initialize();
  }

  private initializeEventListeners() {
    this.client.on('qr', (qr) => {
      logger.info('QR Code empfangen, bitte scannen:');
      qrcode.generate(qr, { small: true });
    });

    this.client.on('ready', () => {
      logger.info('WhatsApp Client ist bereit!');
    });

    this.client.on('message_create', this.handleMessage.bind(this));

    this.client.on('auth_failure', (msg) => {
      logger.error(`Authentifizierungsfehler: ${msg}`);
    });

    this.client.on('disconnected', (reason) => {
      logger.warn(`Client wurde abgemeldet: ${reason}`);
    });
  }

  private async handleMessage(message: Message) {
    const body = message.body;
    if (!body.startsWith(config.PREFIX)) return;

    const args = body.slice(config.PREFIX.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();

    if (!commandName) return;

    const command = this.commands.get(commandName);

    if (!command) {
        // You might want to reply to the user that the command doesn't exist.
        return;
    }

    try {
      logger.info(`Executing command: ${commandName} with args: [${args.join(', ')}]`);
      await command.execute(message, args, { client: this.client, bot: this });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error({ err: error }, `Error executing command: ${commandName}: ${errorMessage}`);
      message.reply('An error occurred while executing that command.');
    }
  }

  public async loadCommands() {
    logger.info('Loading commands...');
    const commandFolders = ['', 'legacy'];
    let count = 0;

    for (const folder of commandFolders) {
        const commandPath = path.join(__dirname, 'commands', folder);
        if (!fs.existsSync(commandPath)) continue;

        const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

        for (const file of commandFiles) {
            try {
                const filePath = path.join(commandPath, file);
                const commandModule = await import(filePath);
                const command: Command = commandModule.default;

                // Runtime check to ensure the imported module has the correct shape
                if (command && typeof command.name === 'string' && typeof command.execute === 'function') {
                    this.commands.set(command.name, command);
                    logger.debug(`Loaded command: ${command.name}`);
                    count++;
                } else {
                    logger.warn(`The file at ${filePath} does not export a valid command.`);
                }
            } catch (error) {
                logger.error(error, `Failed to load command from file: ${file}`);
            }
        }
    }
    logger.info(`${count} commands loaded successfully.`);
  }

  public getCommands(): Map<string, Command> {
    return this.commands;
  }
}
