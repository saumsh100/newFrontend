
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { SubmissionError } from 'redux-form';
import { updateEntityRequest } from '../../../thunks/fetchEntities';
import { Link, VButton } from '../../library';
import ConnectorSettingsForm from './ConnectorSettingsForm';
import styles from './styles.scss';

class Settings extends Component {
  constructor(props) {
    super(props);

    this.handleSettingsSubmit = this.handleSettingsSubmit.bind(this);
  }

  handleSettingsSubmit(values) {
    const { account, history } = this.props;
    const model = account.merge(values);
    return this.props.updateEntityRequest({ key: 'accounts', model })
      .then(() => {
        history.push('./panel');
      });
  }

  render() {
    const { account } = this.props;
    if (!account) return null;

    const adapterType = account.get('adapterType');
    const initialValues = { adapterType };
    return (
      <div className={styles.settingsWrapper}>
        <div className={styles.subHeader}>
          Select your practice management software with the correct version (ie. Tracker 11).
        </div>
        <ConnectorSettingsForm
          initialValues={initialValues}
          onSubmit={this.handleSettingsSubmit}
        />
      </div>
    );
  }
}

Settings.propTypes = {
  //updateReview: PropTypes.func.isRequired,
};

function mapStateToProps({ entities, auth }) {
  // Return activeAccount model
  return {
    account: entities.getIn(['accounts', 'models', auth.get('accountId')]),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateEntityRequest,
  }, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Settings));
