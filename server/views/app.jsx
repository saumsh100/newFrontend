
import React from 'react';
import PropTypes from 'prop-types';
import helpers from '../config/jsxTemplates';

const App = ({ showNewFont }) => (
  <html lang="en" className="Dashboard">
    <head>
      {helpers.appendIntercomScripts()}
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
      <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>CareCru</title>
      <link href="/fontawesome/fontawesome-all.css" rel="stylesheet" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/favicons/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        href="/favicons/favicon-32x32.png"
        sizes="32x32"
      />
      <link
        rel="icon"
        type="image/png"
        href="/favicons/favicon-16x16.png"
        sizes="16x16"
      />
      <link rel="manifest" href="/favicons/manifest.json" />
      <link
        rel="mask-icon"
        href="/favicons/safari-pinned-tab.svg"
        color="#5bbad5"
      />
      <link rel="shortcut icon" href="/favicons/favicon.ico" />
      {helpers.appendFonts(showNewFont)}
      {helpers.appendFullStoryScript()}
    </head>
    <body style={{ fontFamily: 'Gotham-Book' }} className="Dashboard">
      {/* Regions */}
      <div id="root" />

      {helpers.injectJS('vendor')}
      {helpers.injectJS('common')}
      {helpers.injectJS('app')}
      {React.createElement('script', {
        type: 'application/javascript',
        src: 'https://modeanalytics.com/embed/embed.js',
      })}
    </body>
  </html>
);

module.exports = App;

App.propTypes = { showNewFont: PropTypes.bool };

App.defaultProps = { showNewFont: false };
