import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import loadable from '@loadable/component';

const base = (path = '') => `/chat${path}`;

const Routes = {
  chat: loadable(() => import('../../components/Chat')),
  communicationsChat: loadable(() => import('../../micro-front-ends/communications/chat')),
};

const Chat = ({ useCommunicationsChat }) =>
  useCommunicationsChat ? (
    <DocumentTitle title="CareCru | Chat">
      <Switch>
        <Route exact path={base()} component={Routes.communicationsChat} />
        <Route path={base('/:chatId')} component={Routes.communicationsChat} />
      </Switch>
    </DocumentTitle>
  ) : (
    <DocumentTitle title="CareCru | Chat">
      <Switch>
        <Route exact path={base()} component={Routes.chat} />
        <Route path={base('/:chatId')} component={Routes.chat} />
      </Switch>
    </DocumentTitle>
  );

const mapStateToProps = ({ featureFlags }) => ({
  useCommunicationsChat: featureFlags.getIn(['flags', 'use-chat-from-communications-service']),
});

export default connect(mapStateToProps)(Chat);

Chat.propTypes = {
  useCommunicationsChat: PropTypes.bool,
};

Chat.defaultProps = {
  useCommunicationsChat: false,
};
