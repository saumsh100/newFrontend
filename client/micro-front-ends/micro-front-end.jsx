import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDeepCompareEffect } from 'react-use';
import historyShape from '../components/library/PropTypeShapes/historyShape';
import locationShape from '../components/library/PropTypeShapes/locationShape';

function MicroFrontend({ name, host, document, window, location, ...rest }) {
  const renderMicroFrontend = useCallback(() => {
    let locationState;
    try {
      const { state: stateString } = location;
      locationState = JSON.parse(JSON.stringify(stateString));
    } catch (error) {
      locationState = undefined;
    }

    const history = {
      ...rest.history,
      location: {
        ...location,
        state: locationState,
      },
    };

    window[`render${name}`](`${name}-container`, { history });
  }, [location, name, rest.history]);

  useDeepCompareEffect(() => {
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
        document.body.appendChild(script);

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
  }, [renderMicroFrontend]);

  return <main id={`${name}-container`} />;
}

MicroFrontend.defaultProps = {
  document,
  window,
};

MicroFrontend.propTypes = {
  document: PropTypes.instanceOf(document.constructor),
  history: PropTypes.shape(historyShape).isRequired,
  location: PropTypes.shape(locationShape).isRequired,
  host: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  window: PropTypes.instanceOf(window.constructor),
};

export default MicroFrontend;
