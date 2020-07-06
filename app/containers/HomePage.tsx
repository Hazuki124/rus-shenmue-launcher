import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import types from '../actions';
import Home from '../components/Home';
import { counterStateType } from '../reducers/types';
import {
  AvailableVersionType,
  DownloadProgressType,
  GameType
} from '../components/GameCard';

function mapStateToProps(state: counterStateType) {
  return {
    ...state.home
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    fetchIniFile: (link: string) =>
      dispatch({ type: types.DOWNLOAD_INI_FILE_REQUEST, payload: link }),
    fetchGameList: () => dispatch({ type: types.RETRIEVE_GAME_LIST_REQUEST }),
    changeGameDirectory: (game: GameType) =>
      dispatch({ type: types.CHANGE_GAME_DIRECTORY_REQUEST, payload: game }),
    uninstallTranslation: (game: GameType) =>
      dispatch({
        type: types.UNINSTALL_TRANSLATION_REQUEST,
        payload: { game }
      }),
    downloadTranslationUpdate: (
      availableVersion: AvailableVersionType,
      game: GameType
    ) =>
      dispatch({
        type: types.DOWNLOAD_TRANSLATION_UPDATE_REQUEST,
        payload: { game, availableVersion }
      }),
    downloadTranslationUpdateSuccess: (
      file: string,
      game: GameType,
      availableVersion: AvailableVersionType
    ) =>
      dispatch({
        type: types.DOWNLOAD_TRANSLATION_UPDATE_SUCCESS,
        payload: { file, game, availableVersion }
      }),
    downloadTranslationUpdateFailed: (
      game: GameType,
      availableVersion: AvailableVersionType
    ) =>
      dispatch({
        type: types.DOWNLOAD_TRANSLATION_UPDATE_FAILURE,
        payload: { game, availableVersion }
      }),
    downloadTranslationUpdateProgress: (
      game: GameType,
      availableVersion: AvailableVersionType,
      progress: DownloadProgressType
    ) =>
      dispatch({
        type: types.DOWNLOAD_TRANSLATION_PROGRESS_REQUEST,
        payload: { game, availableVersion, progress }
      })
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
