
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import { version } from '../../package.json';

const { NODE_ENV, LOGROCKET_APP_ID } = process.env;

if (NODE_ENV === 'production') {
  LogRocket.init(LOGROCKET_APP_ID, {
    mergeIframes: true,
    release: version,
  });
  setupLogRocketReact(LogRocket);
}
