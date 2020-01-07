
import PropTypes from 'prop-types';
import React, { lazy } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import DocumentTitle from 'react-document-title';

const base = (path = '') => `/chat${path}`;

const Routes = {
  chat: lazy(() => import('../../components/Chat')),
};

const Chat = ({ newChat }) =>
  (newChat ? (
    <DocumentTitle title="CareCru | Chat">
      <Switch>
        <Route exact path={base()} component={Routes.chat} />
        <Route path={base('/:chatId')} component={Routes.chat} />
      </Switch>
    </DocumentTitle>
  ) : (
    <DocumentTitle title="CareCru | Chat">
      <Switch>
        <Route exact path={base()} component={Routes.chat} />
        <Route path={base('/:chatId')} component={Routes.chat} />
      </Switch>
    </DocumentTitle>
  ));

const mapStateToProps = ({ featureFlags }) => ({
  newChat: featureFlags.getIn(['flags', 'chat-2-0-front-end']),
});

export default connect(mapStateToProps)(Chat);

Chat.propTypes = {
  newChat: PropTypes.bool,
};

Chat.defaultProps = {
  newChat: false,
};
