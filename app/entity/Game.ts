import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('game')
export default class Game {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column('text', { nullable: true })
  name?: string;

  @Column('text', { name: 'display_name', nullable: true })
  displayName?: string;

  @Column('text', { nullable: true })
  image?: string;

  @Column('text', { name: 'executable_path', nullable: true })
  executablePath?: string;

  @Column('text', { nullable: true })
  directory?: string;

  @Column('text', { name: 'directory_hint', nullable: true })
  directoryHint?: string;

  @Column('text', { name: 'current_version', nullable: true })
  currentVersion?: string;
}
