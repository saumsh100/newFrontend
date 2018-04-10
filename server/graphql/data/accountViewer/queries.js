
import { accountViewerType } from './types';
import { AccountViewer } from '../types';

export default {
  accountViewer: {
    type: accountViewerType,
    // This create a new AccountViewer based on the sessionData
    resolve: (obj, args, context) => new AccountViewer(context.sessionData),
  },
};
    
