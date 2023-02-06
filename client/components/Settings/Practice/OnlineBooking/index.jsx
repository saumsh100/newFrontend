import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { Header, CodeSnippet } from '../../../library/index';
import { updateEntityRequest } from '../../../../thunks/fetchEntities';
import accountModel from '../../../../entities/models/Account';
import PreferencesForm from './PreferencesForm';
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
    const { activeAccount, role, onlineSchedulerFlag } = this.props;

    if (!activeAccount) {
      return null;
    }

    const { location } = window;
    const port = location.port ? `:${location.port}` : '';
    const hostname =
      window.location.hostname.split('.').length === 3
        ? window.location.hostname.split('.').slice(1).join('.')
        : window.location.hostname;
    const subDomain = process.env.MY_SUBDOMAIN;
    const domainURL = onlineSchedulerFlag
      ? process.env.ONLINE_SCHEDULER_URL
      : `${location.protocol}//${subDomain}.${hostname}${port}`;
    const snippet = `<script type="text/javascript" src="${domainURL}/widgets/${activeAccount.id}/cc.js"></script>`;

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
          <SchedulingPreviewForm
            activeAccount={activeAccount}
            domainURL={domainURL}
            onlineSchedulerFlag={onlineSchedulerFlag}
          />
        </div>
        {(role === 'SUPERADMIN' || role === 'OWNER') && (
          <div className={styles.snippetContainer}>
            <div className={styles.label}>
              <Header title="HTML SNIPPET " contentHeader />
              Copy and paste the snippet below into your website, at the bottom of your body tag.
            </div>
            <CodeSnippet codeSnippet={snippet} />
          </div>
        )}
      </SettingsCard>
    );
  }
}

OnlineBooking.propTypes = {
  activeAccount: PropTypes.instanceOf(accountModel).isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
  role: PropTypes.string.isRequired,
  onlineSchedulerFlag: PropTypes.bool.isRequired,
};

function mapStateToProps({ entities, auth, featureFlags }) {
  const activeAccount = entities.getIn(['accounts', 'models', auth.get('accountId')]);
  const role = auth.get('role');
  const onlineSchedulerFlag = featureFlags.getIn(['flags', 'enable-separate-online-scheduler']);
  return activeAccount ? { activeAccount, role, onlineSchedulerFlag } : {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ updateEntityRequest }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(OnlineBooking);
