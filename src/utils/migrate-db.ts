import conf from '~/conf';
import fs from 'fs';
import path from 'path';
import Logger from '~/services/LoggerService';
import { UserModel } from '~/models/UserModel';
import { getUTC } from './utils';



const MIGRATION_CACHE_PATH = `${conf.variables.volumes.logs}/migration.json`;



/** Check whether something migrated or not */
function checkMigrationStatus(slug: string) {
  if (!fs.existsSync(MIGRATION_CACHE_PATH)) {
    fs.mkdirSync(path.dirname(MIGRATION_CACHE_PATH), { recursive: true });
    fs.writeFileSync(MIGRATION_CACHE_PATH, JSON.stringify({}, null, 2));
  }

  const status = JSON.parse(fs.readFileSync(MIGRATION_CACHE_PATH).toString()) as Record<string, boolean>;

  return status[slug];
}



/** Finish migration of something */
function finishMigration(slug: string) {
  if (!fs.existsSync(MIGRATION_CACHE_PATH)) fs.writeFileSync(MIGRATION_CACHE_PATH, JSON.stringify({}, null, 2));

  const status = JSON.parse(fs.readFileSync(MIGRATION_CACHE_PATH).toString()) as Record<string, boolean>;
  status[slug] = true;

  fs.writeFileSync(MIGRATION_CACHE_PATH, JSON.stringify(status, null, 2));

  Logger.info(`[${slug}]: Migration finished`);
}



export async function MigrateDB() {
  const slug = 'MigrateDB';
  if (checkMigrationStatus(slug)) return;

  try {
    const users = await UserModel.find();

    for (const key in users) {
      const user = users[key];

      user.set('rights', undefined, { strict: false });
      user.set('participateChatsIds', undefined, { strict: false });

      // @ts-ignore
      const birthday = user.birthday as number | null;

      user.birthday = {
        at: birthday ? getUTC(birthday).ISO : null,
        changed_at: null,
        notified_year: null,
        warned_year: null
      };

      user.variables = {
        recieve_birthday_notifications: false
      };

      await user.save();

      Logger.info(`[Migration]: Saved userId=${user.id}`);
    }

    finishMigration(slug);
  } catch (e) {
    Logger.error(`[${slug}]: Cannot update anime documents`, e);
  }
}