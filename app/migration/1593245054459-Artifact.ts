import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  getRepository
} from 'typeorm';
import Artifact, { actions, events } from '../entity/Artifact';

export class Artifact1593245054459 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'artifact',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true
          },
          {
            name: 'game',
            type: 'int',
            isNullable: false
          },
          {
            name: 'sequence',
            type: 'int',
            isNullable: false
          },
          {
            name: 'event',
            type: 'varchar',
            isNullable: false
          },
          {
            name: 'action',
            type: 'varchar',
            isNullable: false
          },
          {
            name: 'original_filename',
            type: 'varchar',
            isNullable: true
          },
          {
            name: 'replace_filename',
            type: 'varchar',
            isNullable: true
          }
        ]
      }),
      true
    );

    await queryRunner.createIndex(
      'artifact',
      new TableIndex({
        name: 'IDX_GAME_ID',
        columnNames: ['game']
      })
    );

    // Seed the DB
    const repo = await getRepository(Artifact);

    // Shenmue I
    const artifact1 = new Artifact();
    artifact1.id = 1;
    artifact1.game = 1;
    artifact1.sequence = 1;
    artifact1.action = actions.DELETE;
    artifact1.event = events.UNINSTALL;
    artifact1.originalFilename = 'sm1\\archives\\dx11\\data\\rus_textury.tac';
    await repo.save(artifact1);

    const artifact2 = new Artifact();
    artifact2.id = 2;
    artifact2.game = 1;
    artifact2.sequence = 2;
    artifact2.action = actions.DELETE;
    artifact2.event = events.UNINSTALL;
    artifact2.originalFilename = 'sm1\\archives\\dx11\\data\\rus_textury.tad';
    await repo.save(artifact2);

    const artifact3 = new Artifact();
    artifact3.id = 3;
    artifact3.game = 1;
    artifact3.sequence = 3;
    artifact3.action = actions.DELETE;
    artifact3.event = events.UNINSTALL;
    artifact3.originalFilename = 'sm1\\archives\\dx11\\data\\sm_rus.tac';
    await repo.save(artifact3);

    const artifact4 = new Artifact();
    artifact4.id = 4;
    artifact4.game = 1;
    artifact4.sequence = 4;
    artifact4.action = actions.DELETE;
    artifact4.event = events.UNINSTALL;
    artifact4.originalFilename = 'sm1\\archives\\dx11\\data\\sm_rus.tad';
    await repo.save(artifact4);

    const artifact13 = new Artifact();
    artifact13.id = 13;
    artifact13.game = 1;
    artifact13.sequence = 5;
    artifact13.action = actions.DELETE;
    artifact13.event = events.UNINSTALL;
    artifact13.originalFilename = 'sm1\\archives\\dx11\\data\\rus_txt.tac';
    await repo.save(artifact13);

    const artifact14 = new Artifact();
    artifact14.id = 14;
    artifact14.game = 1;
    artifact14.sequence = 6;
    artifact14.action = actions.DELETE;
    artifact14.event = events.UNINSTALL;
    artifact14.originalFilename = 'sm1\\archives\\dx11\\data\\rus_txt.tad';
    await repo.save(artifact14);

    const artifact15 = new Artifact();
    artifact15.id = 15;
    artifact15.game = 1;
    artifact15.sequence = 6;
    artifact15.action = actions.DELETE;
    artifact15.event = events.UNINSTALL;
    artifact15.originalFilename = 'sm1\\archives\\dx11\\data\\rus_img.tac';
    await repo.save(artifact15);

    const artifact16 = new Artifact();
    artifact16.id = 16;
    artifact16.game = 1;
    artifact16.sequence = 6;
    artifact16.action = actions.DELETE;
    artifact16.event = events.UNINSTALL;
    artifact16.originalFilename = 'sm1\\archives\\dx11\\data\\rus_img.tad';
    await repo.save(artifact16);

    // Shenmue II
    const artifact5 = new Artifact();
    artifact5.id = 5;
    artifact5.game = 2;
    artifact5.sequence = 1;
    artifact5.action = actions.DELETE;
    artifact5.event = events.UNINSTALL;
    artifact5.originalFilename = 'sm2\\archives\\dx11\\data\\sm2_img.tac';
    await repo.save(artifact5);

    const artifact6 = new Artifact();
    artifact6.id = 6;
    artifact6.game = 2;
    artifact6.sequence = 2;
    artifact6.action = actions.DELETE;
    artifact6.event = events.UNINSTALL;
    artifact6.originalFilename = 'sm2\\archives\\dx11\\data\\sm2_img.tad';
    await repo.save(artifact6);

    const artifact7 = new Artifact();
    artifact7.id = 7;
    artifact7.game = 2;
    artifact7.sequence = 3;
    artifact7.action = actions.DELETE;
    artifact7.event = events.UNINSTALL;
    artifact7.originalFilename = 'sm2\\archives\\dx11\\data\\sm2_txt.tac';
    await repo.save(artifact7);

    const artifact8 = new Artifact();
    artifact8.id = 8;
    artifact8.game = 2;
    artifact8.sequence = 4;
    artifact8.action = actions.DELETE;
    artifact8.event = events.UNINSTALL;
    artifact8.originalFilename = 'sm2\\archives\\dx11\\data\\sm2_txt.tad';
    await repo.save(artifact8);

    const artifact11 = new Artifact();
    artifact11.id = 11;
    artifact11.game = 2;
    artifact11.sequence = 5;
    artifact11.action = actions.DELETE;
    artifact11.event = events.UNINSTALL;
    artifact11.originalFilename = 'sm2\\archives\\dx11\\data\\sm2_rus.tac';
    await repo.save(artifact11);

    const artifact12 = new Artifact();
    artifact12.id = 12;
    artifact12.game = 2;
    artifact12.sequence = 6;
    artifact12.action = actions.DELETE;
    artifact12.event = events.UNINSTALL;
    artifact12.originalFilename = 'sm2\\archives\\dx11\\data\\sm2_rus.tad';
    await repo.save(artifact12);

    // Shenmue III
    const artifact9 = new Artifact();
    artifact9.id = 9;
    artifact9.game = 3;
    artifact9.sequence = 1;
    artifact9.action = actions.DELETE;
    artifact9.event = events.UNINSTALL;
    artifact9.originalFilename =
      'Shenmue3\\Content\\Paks\\pakchunk999-WindowsNoEditor_RUS.pak';
    await repo.save(artifact9);

    const artifact10 = new Artifact();
    artifact10.id = 10;
    artifact10.game = 3;
    artifact10.sequence = 2;
    artifact10.action = actions.DELETE;
    artifact10.event = events.UNINSTALL;
    artifact10.originalFilename =
      'Shenmue3\\Content\\Paks\\pakchunk999-WindowsNoEditor_RUS.sig';
    await repo.save(artifact10);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // do nothing
  }
}
