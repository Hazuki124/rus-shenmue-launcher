import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  getRepository
} from 'typeorm';
import Game from '../entity/Game';

export class Game1593245054458 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'game',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false
          },
          {
            name: 'display_name',
            type: 'varchar',
            isNullable: false
          },
          {
            name: 'image',
            type: 'varchar',
            isNullable: false
          },
          {
            name: 'executable_path',
            type: 'varchar',
            isNullable: false
          },
          {
            name: 'directory',
            type: 'varchar',
            isNullable: true
          },
          {
            name: 'directory_hint',
            type: 'varchar',
            isNullable: true
          },
          {
            name: 'current_version',
            type: 'varchar',
            isNullable: true
          }
        ]
      }),
      true
    );

    await queryRunner.createIndex(
      'game',
      new TableIndex({
        name: 'IDX_GAME_TITLE',
        columnNames: ['name']
      })
    );

    // Seed the DB
    // TODO: replace it with better solution
    const repo = await getRepository(Game);
    const shenmueI = new Game();
    shenmueI.id = 1;
    shenmueI.name = 'Shenmue1';
    shenmueI.displayName = 'Shenmue I';
    shenmueI.image = './assets/image/shenmue-1.jpg';
    shenmueI.executablePath = '\\sm1\\Shenmue.exe';
    shenmueI.directoryHint = 'SMLaunch';
    await repo.save(shenmueI);

    const shenmueII = new Game();
    shenmueII.id = 2;
    shenmueII.name = 'Shenmue2';
    shenmueII.displayName = 'Shenmue II';
    shenmueII.image = './assets/image/shenmue-2.jpg';
    shenmueII.executablePath = '\\sm2\\Shenmue2.exe';
    shenmueII.directoryHint = 'SMLaunch';
    await repo.save(shenmueII);

    const shenmueIII = new Game();
    shenmueIII.id = 3;
    shenmueIII.name = 'Shenmue3';
    shenmueIII.displayName = 'Shenmue III';
    shenmueIII.image = './assets/image/shenmue-3.jpg';
    shenmueIII.executablePath =
      '\\Shenmue3\\Binaries\\Win64\\Shenmue3-Win64-Shipping.exe';
    shenmueIII.directoryHint = 'Shenmue3';
    await repo.save(shenmueIII);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // do nothing
  }
}
