
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Settings from '../components/Settings';

function SettingsContainer(props) {
  return <Settings {...props}>{props.children}</Settings>;
}

SettingsContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

function mapStateToProps({ entities, auth }) {
  return {
    activeAccount: entities.getIn(['accounts', 'models', auth.get('accountId')]),
    users: entities.getIn(['users', 'models']),
  };
}

const enhance = connect(mapStateToProps);

export default enhance(SettingsContainer);
