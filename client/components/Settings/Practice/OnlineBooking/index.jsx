import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { Header, CodeSnippet } from '../../../library/index';
import { updateEntityRequest } from '../../../../thunks/fetchEntities';
import accountModel from '../../../../entities/models/Account';
import PreferencesForm from './PreferencesForm';
import ChairSchedulingForm from './ChairSchedulingForm';
import SchedulingUrlForm from './SchedulingUrlForm';
import SchedulingPreviewForm from './SchedulingPreviewForm';
import SettingsCard from '../../Shared/SettingsCard';
import styles from './styles.scss';

class OnlineBooking extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    const { activeAccount } = this.props;
    const valuesMap = Map(values);
    const modifiedAccount = activeAccount.merge(valuesMap);
    const alert = {
      success: { body: 'Booking Widget Preferences Updated' },
      error: {
        Title: 'Preferences Error',
        body: 'Booking Widget Update Failed',
      },
    };
    this.props.updateEntityRequest({
      key: 'accounts',
      model: modifiedAccount,
      alert,
    });
  }

  render() {
    const { activeAccount, role } = this.props;

    if (!activeAccount) {
      return null;
    }

    const { location } = window;
    const port = location.port ? `:${location.port}` : '';
    const hostname =
      window.location.hostname.split('.').length === 3
        ? window.location.hostname
            .split('.')
            .slice(1)
            .join('.')
        : window.location.hostname;
    const subDomain = process.env.MY_SUBDOMAIN;
    const snippet = `<script type="text/javascript" src="${location.protocol}//${subDomain}.${hostname}${port}/widgets/${activeAccount.id}/cc.js"></script>`;

    return (
      <SettingsCard title="Online Booking" bodyClass={styles.onlineBookingBody}>
        <div className={styles.formContainer}>
          <Header title="Customize Widget" contentHeader />
          <PreferencesForm
            role={role}
            activeAccount={activeAccount}
            handleSubmit={this.handleSubmit}
          />
        </div>
        <div className={styles.formContainer}>
          <Header title="Online Scheduling URL" contentHeader />
          <SchedulingUrlForm activeAccount={activeAccount} handleSubmit={this.handleSubmit} />
        </div>
        <div className={styles.formContainer}>
          <Header title="Online Scheduling Widget Preview" contentHeader />
          <SchedulingPreviewForm activeAccount={activeAccount} />
        </div>
        {(role === 'SUPERADMIN' || role === 'OWNER') && (
          <>
            <div className={styles.formContainer}>
              <Header title="Chair Scheduling" contentHeader />
              <ChairSchedulingForm activeAccount={activeAccount} handleSubmit={this.handleSubmit} />
            </div>
            <div className={styles.snippetContainer}>
              <div className={styles.label}>
                HTML SNIPPET Copy and paste the snippet below into your website, at the bottom of
                your body tag.
              </div>
              <CodeSnippet codeSnippet={snippet} />
            </div>
          </>
        )}
      </SettingsCard>
    );
  }
}

OnlineBooking.propTypes = {
  activeAccount: PropTypes.instanceOf(accountModel).isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
  role: PropTypes.string.isRequired,
};

function mapStateToProps({ entities, auth }) {
  const activeAccount = entities.getIn(['accounts', 'models', auth.get('accountId')]);
  const role = auth.get('role');
  return activeAccount ? { activeAccount, role } : {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ updateEntityRequest }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(OnlineBooking);
