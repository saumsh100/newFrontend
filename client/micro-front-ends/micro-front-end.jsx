import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import historyShape from '../components/library/PropTypeShapes/historyShape';

function MicroFrontend({ name, host, document, window, ...rest }) {
  useEffect(() => {
    const scriptId = `micro-frontend-script-${name}`;

    if (document.getElementById(scriptId)) {
      renderMicroFrontend();
      return undefined;
    }

    fetch(`${host}/asset-manifest.json`)
      .then((res) => res.json())
      .then((manifest) => {
        // this is for the JavaScript
        const mainJsFileName = manifest.files['main.js'];
        const script = document.createElement('script');
        script.id = scriptId;
        script.crossOrigin = '';
        script.src = `${host}${mainJsFileName}`;
        script.onload = renderMicroFrontend;
        document.head.appendChild(script);

        // this is for the CSS
        const mainCssFileName = manifest.files['main.css'];
        const link = document.createElement('link');
        link.href = `${host}${mainCssFileName}`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      })
      .catch(() => {
        console.error(`ERROR fetching manifest for ${name} @ ${host}`);
      });

    return () => {
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
