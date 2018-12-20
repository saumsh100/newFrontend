
import React from 'react';
import helpers from '../config/jsxTemplates';

const App = () => (
  <html lang="en" className="Dashboard">
    <head>
      {helpers.appendIntercomScripts()}

      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      {/* <meta name="csrf-token" content={{csrfToken}}> */}

      <title>CareCru</title>
      <link href="/fontawesome/fontawesome-all.css" rel="stylesheet" />
      <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
      <link rel="icon" type="image/png" href="/favicons/favicon-32x32.png" sizes="32x32" />
      <link rel="icon" type="image/png" href="/favicons/favicon-16x16.png" sizes="16x16" />
      <link rel="manifest" href="/favicons/manifest.json" />
      <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#5bbad5" />
      <link rel="shortcut icon" href="/favicons/favicon.ico" />

      {helpers.appendFonts()}

      {helpers.productionCSS('app-commons.js')}
      {helpers.productionCSS('app')}
    </head>
    <body style={{ fontFamily: 'Gotham-Book' }} className="Dashboard">
      {/* Regions */}
      <div id="root" />

      {/* <script>
              window.__CURRENT_USER__ = {{{user}}};
              window.__ACTIVE_ACCOUNT__ = {{{activeAccount}}};
          </script> */}

      {helpers.injectJS('vendor')}
      {helpers.injectJS('common')}
      {helpers.injectJS('app')}

      <script src="https://modeanalytics.com/embed/embed.js"></script>
    </body>
  </html>
);

module.exports = App;
