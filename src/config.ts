import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();



const configSchema = z.object({
  BOT_NAME: z.string().default('Cotti WhatsApp App'),
  PREFIX: z.string().default('!'),
  MAX_FILE_SIZE_MB: z.coerce.number().positive().default(100),
  TEMP_DIR: z.string().default('./temp'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent']).default('info'),
  TEST_MODE: z.preprocess((val) => String(val).toLowerCase() === 'true', z.boolean()).default(false),
});

export type Config = z.infer<typeof configSchema>;

let config: Config;

try {
  const parsedConfig = configSchema.parse(process.env);

  // Check for --test flag as an override
  if (process.argv.includes('--test')) {
    parsedConfig.TEST_MODE = true;
  }

  // Make the config object immutable
  config = Object.freeze(parsedConfig);

} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('Configuration validation failed:', JSON.stringify(error.issues, null, 2));
    process.exit(1);
  }
  throw error;
}

export default config;
