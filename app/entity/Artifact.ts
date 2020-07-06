import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export const events = {
  INSTALL: 'INSTALL',
  UNINSTALL: 'UNINSTALL'
};

export const actions = {
  DELETE: 'DELETE'
};

@Entity('artifact')
export default class Artifact {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column('mediumint')
  game!: number;

  @Column('mediumint')
  sequence!: number;

  @Column('varchar')
  event!: string;

  @Column('varchar')
  action!: string;

  @Column('text', { name: 'original_filename', nullable: true })
  originalFilename?: string;

  @Column('text', { name: 'replace_filename', nullable: true })
  replaceFilename?: string;
}
