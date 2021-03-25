import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import historyShape from '../components/library/PropTypeShapes/historyShape';

function MicroFrontend({ name, host, document, window, ...rest }) {
  useEffect(() => {
    const scriptId = `micro-frontend-script-${name}`;

    if (document.getElementById(scriptId)) {
      console.log(`FOUND script - ${scriptId}`);
      renderMicroFrontend();
      return undefined;
    }

    console.log('FETCHING manifest');

    fetch(`${host}/asset-manifest.json`)
      .then((res) => res.json())
      .then((manifest) => {
        const script = document.createElement('script');
        script.id = scriptId;
        script.crossOrigin = '';
        script.src = `${host}${manifest.files['main.js']}`;
        script.onload = renderMicroFrontend;
        console.log('INFO: ', scriptId, script.src);
        document.head.appendChild(script);
      })
      .catch(() => {
        console.log(`ERROR fetching manifest for ${name} @ ${host}`);
      });

    return () => {
      console.log(`UNMOUNTING ${name}-container`);
      window[`unmount${name}`]?.(`${name}-container`);
    };
    // eslint-disable-next-line
  }, []);

  function renderMicroFrontend() {
    let locationState;
    try {
      const { state: stateString } = rest.history.location;
      locationState = JSON.parse(JSON.stringify(stateString));
    } catch (error) {
      locationState = undefined;
    }

    const history = {
      ...rest.history,
      location: {
        ...rest.history.location,
        state: locationState,
      },
    };

    window[`render${name}`](`${name}-container`, { history });
  }

  return <main id={`${name}-container`} />;
}

MicroFrontend.defaultProps = {
  document,
  window,
};

MicroFrontend.propTypes = {
  document: PropTypes.instanceOf(document.constructor),
  history: PropTypes.shape(historyShape).isRequired,
  host: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  window: PropTypes.instanceOf(window.constructor),
};

export default MicroFrontend;
