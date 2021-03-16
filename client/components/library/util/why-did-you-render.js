
import React from 'react';

/* eslint-disable global-require */
if (process.env.NODE_ENV === 'development' && process.env.DEBUG === 'true') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  const ReactRedux = require('react-redux');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    trackHooks: false,
    trackExtraHooks: [
      [ReactRedux, 'useSelector'],
      [ReactRedux, 'useDispatch'],
      [ReactRedux, 'useStore'],
    ],
  });
}
