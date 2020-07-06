export const GAME_LIST_REQUEST = 'GAME_LIST_REQUEST';
export const GAME_LIST_SUCCESS = 'GAME_LIST_SUCCESS';
export const GAME_LIST_FAILURE = 'GAME_LIST_FAILURE';

export function loaded() {
  return {
    type: GAME_LIST_REQUEST
  };
}
