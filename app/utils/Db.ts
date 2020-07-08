import { ConnectionOptions, createConnection, Connection } from 'typeorm';
import { remote } from 'electron';
import path from 'path';
import Game from '../entity/Game';
import { Game1593245054458 } from '../migration/1593245054458-Game';
import { Artifact1593245054459 } from '../migration/1593245054459-Artifact';
import Artifact from '../entity/Artifact';

const dbDirectory =
  process.env.NODE_ENV === 'production'
    ? remote.app.getPath('userData')
    : path.dirname(remote.app.getPath('exe'));

const options: ConnectionOptions = {
  type: 'sqlite',
  database: `${dbDirectory}\\${process.env.DB_NAME}`,
  entities: [Game, Artifact],
  migrations: [Game1593245054458, Artifact1593245054459],
  migrationsRun: true,
  logging: true
};

export default class Db {
  static connection: Connection;

  /**
   * If there is any errors that sqlite3 was not found
   * @See https://github.com/jjhbw/typeorm/commit/f685f016098a6269263a1bf2c8acb91ff398e2d4
   * @See https://github.com/typeorm/typeorm/issues/4210
   * @See https://github.com/typeorm/typeorm/issues/2456
   */
  static async getConnection() {
    if (Db.connection) {
      return Db.connection;
    }

    Db.connection = await createConnection(options);
    return Db.connection;
  }
}
