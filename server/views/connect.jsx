import React from 'react';
import helpers from '../config/jsxTemplates';

class Connect extends React.Component {
  render() {
    return (
      <html lang="en" className="Dashboard">
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          {/* <meta name="csrf-token" content={{csrfToken}}> */}

          <title>CareCru Connector</title>
          <link href="/fontawesome/fontawesome-all.css" rel="stylesheet" />

          {/* favicon file <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon"> */}
          {helpers.appendFonts()}

          {helpers.productionCSS('connect-commons.js')}
          {helpers.productionCSS('connect')}
        </head>
        <body style={{ fontFamily: 'Gotham-Book' }} className="Dashboard">
          {/* Regions */}
          <div id="root" />

          {helpers.injectJS('common.js')}
          {helpers.injectJS('connect')}
        </body>
      </html>
    );
  }
}

module.exports = Connect;
