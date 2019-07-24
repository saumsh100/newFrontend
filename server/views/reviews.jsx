
import React from 'react';
import helpers from '../config/jsxTemplates';

class Reviews extends React.Component {
  render() {
    const { account, initialState } = this.props;

    return (
      <html lang="en" className="Dashboard">
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
          />
          <meta
            httpEquiv="Cache-Control"
            content="no-cache, no-store, must-revalidate"
          />
          <title>CareCru - Reviews</title>
          <link href="/fontawesome/fontawesome-all.css" rel="stylesheet" />
          <link
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700"
            rel="stylesheet"
          />

          {helpers.appendFonts()}
          {helpers.appendFullStoryScript(true)}
        </head>
        <body
          style={{ fontFamily: 'Gotham-Book' }}
          className="Dashboard Widget"
        >
          {/* Regions */}
          <div id="root" />

          <script
            dangerouslySetInnerHTML={{
              __html: `
              window.accountId = '${account.id}';
              window.__INITIAL_STATE__ = ${initialState};
          `,
            }}
          />

          {helpers.injectJS('vendor')}
          {helpers.injectJS('common')}
          {helpers.injectJS('reviews')}
        </body>
      </html>
    );
  }
}

module.exports = Reviews;
