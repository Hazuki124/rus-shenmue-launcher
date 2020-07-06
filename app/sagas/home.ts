import { put, all, takeLatest, takeEvery, call } from 'redux-saga/effects';
import axios from 'axios';
import { remote, ipcRenderer } from 'electron';
import { message } from 'antd';
import ini from 'ini';
import unzipper from 'unzipper';
import fs from 'fs';
import responseError from '../utils/responseError';
import types from '../actions';
import {
  AvailableVersionType,
  DownloadProgressType,
  GameType
} from '../components/GameCard';
import GameUtil from '../utils/GameUtil';
import FileDownloader from '../utils/FileDownloader';
import Notificator from '../utils/Notificator';

function* fetchIniFile(action: { payload: string }) {
  try {
    const { payload: link } = action;
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const response = yield call(axios, {
      method: 'GET',
      url: link
    });
    yield put({
      type: types.DOWNLOAD_INI_FILE_SUCCESS,
      payload: ini.parse(response.data)
    });
  } catch (e) {
    yield put({
      type: types.DOWNLOAD_INI_FILE_FAILURE,
      payload: responseError(e)
    });

    message.warning('Не удалось загрузить информацию об обновлениях', 10);
  }
}

function* retrieveGameList() {
  try {
    const games = yield call(GameUtil.getGameList);
    yield put({
      type: types.RETRIEVE_GAME_LIST_SUCCESS,
      payload: games
    });
  } catch (e) {
    yield put({
      type: types.RETRIEVE_GAME_LIST_FAILURE,
      payload: responseError(e)
    });

    message.error('Не удалось загрузить список игр', 10);
  }
}

function* changeGameDirectory(action: { payload: GameType }) {
  try {
    const { payload: game } = action;
    yield call(GameUtil.updateGame, game);
    yield put({
      type: types.CHANGE_GAME_DIRECTORY_SUCCESS,
      payload: game
    });
  } catch (e) {
    yield put({
      type: types.CHANGE_GAME_DIRECTORY_FAILURE,
      payload: responseError(e)
    });

    message.warning('Не удалось изменить директорию игры', 10);
  }
}

function* downloadTranslationUpdate(action: {
  payload: { availableVersion: AvailableVersionType; game: GameType };
}) {
  try {
    const {
      payload: { availableVersion, game }
    } = action;

    ipcRenderer.send('download', {
      url: FileDownloader.getDownloadLink(availableVersion.url),
      properties: {
        directory: remote.app.getPath('temp')
      },
      game,
      availableVersion
    });
  } catch (e) {
    yield put({
      type: types.DOWNLOAD_TRANSLATION_UPDATE_FAILURE,
      payload: responseError(e)
    });

    message.error('Не удалось установить обновление перевода', 10);
  }
}

function* installTranslation(action: {
  payload: {
    file: string;
    game: GameType;
    availableVersion: AvailableVersionType;
  };
}) {
  try {
    const {
      payload: { file, game, availableVersion }
    } = action;

    yield put({
      type: types.INSTALL_UPDATE_REQUEST,
      payload: { game }
    });

    if (fs.existsSync(file)) {
      fs.createReadStream(file).pipe(
        unzipper.Extract({ path: `${game.directory}` })
      );
    } else {
      throw new Error('Ошибка распаковки обновления');
    }

    yield call(GameUtil.updateGame, {
      ...game,
      currentVersion: availableVersion.version
    });
    yield put({
      type: types.GAME_UPDATE,
      payload: {
        ...game,
        currentVersion: availableVersion.version
      }
    });

    Notificator.notify(game.displayName, 'Обновление установлено');

    yield put({
      type: types.INSTALL_UPDATE_SUCCESS,
      payload: { game }
    });

    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  } catch (e) {
    yield put({
      type: types.INSTALL_UPDATE_FAILURE,
      payload: responseError(e)
    });

    message.error('Ошибка распаковки обновления', 10);
  }
}

function* uninstallTranslation(action: { payload: { game: GameType } }) {
  const {
    payload: { game }
  } = action;
  try {
    yield call(GameUtil.uninstallGame, game);
    yield call(GameUtil.updateGame, {
      ...game,
      currentVersion: null
    });
    yield put({
      type: types.UNINSTALL_TRANSLATION_SUCCESS,
      payload: {
        ...game,
        currentVersion: null
      }
    });
    yield put({
      type: types.GAME_UPDATE,
      payload: {
        ...game,
        currentVersion: null
      }
    });
  } catch (e) {
    yield put({
      type: types.UNINSTALL_TRANSLATION_FAILURE,
      payload: game
    });

    message.warning('Не удалось удалить перевод', 10);
  }
}

function* updateDownloadProgress(action: {
  payload: {
    game: GameType;
    availableVersion: AvailableVersionType;
    progress: DownloadProgressType;
  };
}) {
  const {
    payload: { game, availableVersion, progress }
  } = action;
  try {
    yield put({
      type: types.DOWNLOAD_TRANSLATION_PROGRESS_SUCCESS,
      payload: {
        game,
        availableVersion: {
          ...availableVersion,
          downloadProgress: {
            percent: Math.round(
              (progress.transferredBytes /
                parseInt(String(availableVersion.size), 10)) *
                100
            ),
            totalBytes: parseInt(String(availableVersion.size), 10),
            transferredBytes: progress.transferredBytes
          }
        },
        progress
      }
    });
  } catch (e) {
    yield put({
      type: types.DOWNLOAD_TRANSLATION_PROGRESS_FAILURE,
      payload: {
        ...game,
        ...availableVersion,
        ...progress
      }
    });
  }
}

export default function* home() {
  yield all([
    takeLatest(types.DOWNLOAD_INI_FILE_REQUEST, fetchIniFile),
    takeLatest(types.RETRIEVE_GAME_LIST_REQUEST, retrieveGameList),
    takeEvery(types.CHANGE_GAME_DIRECTORY_REQUEST, changeGameDirectory),
    takeEvery(types.UNINSTALL_TRANSLATION_REQUEST, uninstallTranslation),
    takeEvery(
      types.DOWNLOAD_TRANSLATION_UPDATE_REQUEST,
      downloadTranslationUpdate
    ),
    takeEvery(types.DOWNLOAD_TRANSLATION_UPDATE_SUCCESS, installTranslation),
    takeEvery(
      types.DOWNLOAD_TRANSLATION_PROGRESS_REQUEST,
      updateDownloadProgress
    )
  ]);
}
