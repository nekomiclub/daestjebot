import z, { ZodError } from 'zod';
import { config as dotenvCfg } from 'dotenv';
import { zBoolean } from './utils';



let PRESERVED_ENV: TEnvConfigSchema | null = null;



/** Environment config schema */
export const EnvConfigSchema = z.object({
  MONGODB_HOST: z.string().nonempty(),
  MONGODB_DB: z.string().nonempty(),
  MONGODB_USR: z.string().nonempty(),
  MONGODB_PWD: z.string().nonempty(),

  NODE_ENV: z.enum(['production', 'development']),

  TELEGRAM_API_ID: z.coerce.number().min(0),
  TELEGRAM_API_HASH: z.string().nonempty(),
  TELEGRAM_BOT_TOKEN: z.string().nonempty(),

  /** Whether is docker environment */
  IS_DOCKER: zBoolean.optional(),
});

export type TEnvConfigSchema = z.infer<typeof EnvConfigSchema>



/** @caution should not be used in production. To get specific env, use "env" function */
export function parseEnv(): z.infer<typeof EnvConfigSchema> {
  try {
    dotenvCfg({ quiet: true });

    return EnvConfigSchema.parse(process.env);
  } catch (e) {
    if (e instanceof ZodError) {
      console.log(e);

      throw new Error(`[Env]: Env parse is invalid. Errors: ${JSON.stringify(e, null, 2)}`);
    } else throw e;
  }
}

/** Get enviromental variable function */
function env<K extends keyof TEnvConfigSchema>(key: K): TEnvConfigSchema[K] {
  if (!PRESERVED_ENV) PRESERVED_ENV = parseEnv();

  return PRESERVED_ENV[key];
}



export default env;