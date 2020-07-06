import { createAsyncActions, createSyncActionType } from '../../utils/redux';
import asyncActions from './asyncActions';
import syncActions from './syncActions';

const asyncContants = createAsyncActions(...asyncActions);
const syncContants = createSyncActionType(...syncActions);

export default {
  ...asyncContants,
  ...syncContants
};
