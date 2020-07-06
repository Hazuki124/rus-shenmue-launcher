import fs from 'fs';
import Db from './Db';
import Game from '../entity/Game';
import Artifact, { events, actions } from '../entity/Artifact';
import { GameType } from '../components/GameCard';

export default class GameUtil {
  static async getGameList() {
    const connection = await Db.getConnection();
    const repository = connection.getRepository(Game);
    return repository.find();
  }

  static async updateGame(value: GameType) {
    const connection = await Db.getConnection();
    const repository = connection.getRepository(Game);
    const gameEntity = new Game();
    gameEntity.id = value.id;
    gameEntity.name = value.name;
    gameEntity.displayName = value.displayName;
    gameEntity.image = value.image;
    gameEntity.executablePath = value.executablePath;
    gameEntity.directoryHint = value.directoryHint;
    gameEntity.directory = value.directory;
    gameEntity.currentVersion = value.currentVersion;
    await repository.update(value.id, gameEntity);
  }

  static async uninstallGame(game: GameType): Promise<boolean> {
    try {
      const connection = await Db.getConnection();
      const repository = connection.getRepository(Artifact);
      const artifacts: Artifact[] = await repository.find({
        where: {
          game: game.id
        },
        order: {
          sequence: 'ASC'
        }
      });

      for (const artifact of artifacts) {
        const originalFilename = `${game.directory}/${artifact.originalFilename}`;
        if (artifact.event === events.UNINSTALL) {
          switch (artifact.action) {
            case actions.DELETE:
              if (fs.existsSync(originalFilename)) {
                fs.unlinkSync(originalFilename);
              }
              break;
          }
        }
      }

      return true;
    } catch (e) {
      return false;
    }
  }
}
