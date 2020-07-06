import { forEach } from 'lodash';
import types from '../actions';
import { AvailableVersionType, GameType } from '../components/GameCard';

type modeType = 'movies' | 'shows' | 'search' | 'home';

type actionType = {
  type: string;
  isLoading?: boolean;
};

type homePageReducerStateType = {
  activeMode: modeType;
  infinitePagination: boolean;
  isLoading: boolean;
  availableVersions: { [key: string]: AvailableVersionType };
  items: Array<GameType>;
};

const defaultState: homePageReducerStateType = {
  activeMode: 'home',
  infinitePagination: false,
  isLoading: false,
  availableVersions: {},
  items: []
};

export default function homePageReducer(
  state: homePageReducerStateType = defaultState,
  action: actionType
): homePageReducerStateType {
  let availableVersions: { [key: string]: AvailableVersionType } = {};
  const items: GameType[] = [];
  switch (action.type) {
    case types.DOWNLOAD_INI_FILE_SUCCESS:
      return {
        ...state,
        availableVersions: action.payload
      };
    case types.GAME_UPDATE:
    case types.CHANGE_GAME_DIRECTORY_SUCCESS:
      forEach(state.items, value => {
        if (value.name === action.payload.name) {
          items.push(action.payload);
        } else {
          items.push(value);
        }
      });
      return {
        ...state,
        items
      };
    case types.RETRIEVE_GAME_LIST_REQUEST:
      return {
        ...state,
        isLoading: true
      };
    case types.RETRIEVE_GAME_LIST_SUCCESS:
      forEach(action.payload, game => {
        items.push({
          id: game.id,
          name: game.name,
          displayName: game.displayName,
          image: game.image,
          executablePath: game.executablePath,
          directoryHint: game.directoryHint,
          directory: game.directory,
          currentVersion: game.currentVersion
        });
      });
      return {
        ...state,
        isLoading: false,
        items
      };
    case types.RETRIEVE_GAME_LIST_FAILED:
      return {
        ...state,
        isLoading: false
      };

    case types.DOWNLOAD_TRANSLATION_UPDATE_REQUEST:
      for (const [key, value] of Object.entries(state.availableVersions)) {
        if (key === action.payload.game.name) {
          availableVersions[key] = {
            ...state.availableVersions[key],
            isDownloading: true,
            downloadProgress: {
              percent: 0,
              totalBytes: parseInt(String(state.availableVersions.size), 10),
              transferredBytes: 0
            }
          };
        } else {
          availableVersions[key] = state.availableVersions[key];
        }
      }
      return {
        ...state,
        availableVersions
      };
    case types.DOWNLOAD_TRANSLATION_UPDATE_SUCCESS:
    case types.DOWNLOAD_TRANSLATION_UPDATE_FAILURE:
      for (const [key, value] of Object.entries(state.availableVersions)) {
        if (key === action.payload.game.name) {
          availableVersions[key] = {
            ...state.availableVersions[key],
            isDownloading: false
          };
        } else {
          availableVersions[key] = state.availableVersions[key];
        }
      }
      return {
        ...state,
        availableVersions
      };

    case types.INSTALL_UPDATE_REQUEST:
      for (const [key, value] of Object.entries(state.availableVersions)) {
        if (key === action.payload.game.name) {
          availableVersions[key] = {
            ...state.availableVersions[key],
            isInstalling: true
          };
        } else {
          availableVersions[key] = state.availableVersions[key];
        }
      }
      return {
        ...state,
        availableVersions
      };
    case types.INSTALL_UPDATE_SUCCESS:
    case types.INSTALL_UPDATE_FAILED:
      for (const [key, value] of Object.entries(state.availableVersions)) {
        if (key === action.payload.game.name) {
          availableVersions[key] = {
            ...state.availableVersions[key],
            isInstalling: false
          };
        } else {
          availableVersions[key] = state.availableVersions[key];
        }
      }
      return {
        ...state,
        availableVersions
      };
    case types.UNINSTALL_TRANSLATION_REQUEST:
      for (const [key, value] of Object.entries(state.availableVersions)) {
        if (key === action.payload.game.name) {
          availableVersions[key] = {
            ...state.availableVersions[key],
            isUninstalling: true
          };
        } else {
          availableVersions[key] = state.availableVersions[key];
        }
      }
      return {
        ...state,
        availableVersions
      };
    case types.UNINSTALL_TRANSLATION_SUCCESS:
    case types.UNINSTALL_TRANSLATION_FAILURE:
      for (const [key, value] of Object.entries(state.availableVersions)) {
        if (key === action.payload.name) {
          availableVersions[key] = {
            ...state.availableVersions[key],
            isUninstalling: false,
            downloadProgress: undefined
          };
        } else {
          availableVersions[key] = state.availableVersions[key];
        }
      }
      return {
        ...state,
        availableVersions
      };

    case types.DOWNLOAD_TRANSLATION_PROGRESS_SUCCESS:
      for (const [key, value] of Object.entries(state.availableVersions)) {
        if (key === action.payload.game.name) {
          availableVersions[key] = {
            ...state.availableVersions[key],
            downloadProgress: {
              ...action.payload.availableVersion?.downloadProgress
            }
          };
        } else {
          availableVersions[key] = state.availableVersions[key];
        }
      }
      return {
        ...state,
        availableVersions
      };
    default:
      return state;
  }
}
