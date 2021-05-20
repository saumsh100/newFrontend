import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import historyShape from '../../components/library/PropTypeShapes/historyShape';
import locationShape from '../../components/library/PropTypeShapes/locationShape';
import userShape from '../../components/library/PropTypeShapes/patientUserShape';
import AccountModel from '../../entities/models/Account';
import MicroFrontEnd from '../micro-front-end';

const { CHAT_HOST: chatHost } = process.env;

const Chat = ({ history, location, match, ...rest }) => {
  delete rest.dispatch; // no need for redux at this time
  try {
    history.location.state = rest; // put the required info in to the route state
  } catch (error) {
    history.location.state = undefined;
  }
  const props = { history, location, match };
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <MicroFrontEnd host={chatHost} name="Chat" {...props} />;
};

Chat.defaultProps = {};

Chat.propTypes = {
  Account: PropTypes.instanceOf(AccountModel).isRequired,
  history: PropTypes.shape(historyShape).isRequired,
  location: PropTypes.shape(locationShape).isRequired,
  match: PropTypes.shape({}).isRequired,
  user: PropTypes.shape(userShape).isRequired,
  role: PropTypes.string.isRequired,
};

const mapStateToProps = ({ entities, auth }) => {
  return {
    Account: entities.getIn(['accounts', 'models', auth.get('accountId')]).toJS(),
    user: auth.get('user').toJS(),
    role: auth.get('role'),
  };
};

export default connect(mapStateToProps)(Chat);
