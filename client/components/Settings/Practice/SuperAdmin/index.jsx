
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { Map } from 'immutable';
import jwt from 'jwt-decode';
import { connect } from 'react-redux';
import { Header, Button, DialogBox } from '../../../library';
import {
  fetchEntities,
  createEntityRequest,
  deleteEntityRequest,
  updateEntityRequest,
} from '../../../../thunks/fetchEntities';
import { downloadConnector, sendEmailBlast, getEmailBlastCount } from '../../../../thunks/accounts';
import EmailPreview from '../../Shared/EmailPreview';
import AddAccounts from './AddAccounts';
import SettingsCard from '../../Shared/SettingsCard';
import SuperAdminForm from './SuperAdminForm';
import MassEmailDisplay from './MassEmailDisplay';
import Account from '../../../../entities/models/Account';
import User from '../../../../entities/models/User';
import styles from './styles.scss';

class SuperAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewOpen: false,
    };
    this.sendEmailBlast = this.sendEmailBlast.bind(this);
    this.openPreviewModal = this.openPreviewModal.bind(this);
    this.updateApis = this.updateApis.bind(this);
    this.updateAdminForm = this.updateAdminForm.bind(this);
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    const decodedToken = jwt(token);
    const url = `/api/users/${decodedToken.userId}`;

    this.props.fetchEntities({ url });
  }

  updateAdminForm(values) {
    const { activeAccount } = this.props;
    const valuesMap = Map(values);
    const modifiedAccount = activeAccount.merge(valuesMap);
    const alert = {
      success: {
        body: 'Updated Clinic Information',
      },
      error: {
        title: 'Clinic Information Error',
        body: 'Failed to update.',
      },
    };

    this.props.updateEntityRequest({
      key: 'accounts',
      model: modifiedAccount,
      alert,
    });
  }

  sendEmailBlast() {
    const { activeAccount } = this.props;

    if (activeAccount.massOnlineEmailSentDate) {
      return alert('Sorry but you have already performed this email campaign.');
    }

    const sendEmails = window.confirm('Are you sure you want to send this email blast?');
    const sendEmailsForSure = sendEmails && window.confirm('Are you really sure?');

    if (sendEmailsForSure) {
      this.setState({
        previewOpen: false,
      });
      return this.props.sendEmailBlast(activeAccount.id);
    }
    return null;
  }

  async updateApis(values) {
    const { activeAccount, address } = this.props;
    const {
      reputationManagement, listings, callTracking, canSendReminders,
    } = values;

    const sendingValuesCreate = {};
    sendingValuesCreate.integrations = [];

    const sendingValuesDelete = {};
    sendingValuesDelete.integrations = [];

    const {
      callrailId,
      twilioPhoneNumber,
      vendastaAccountId,
      vendastaMsId,
      vendastaSrId,
      website,
    } = activeAccount;

    const {
      city, state, country, zipCode, street, timezone,
    } = address;

    if (!city || !state || !country || !street || !zipCode || !timezone || !website) {
      return window.alert('Please enter Address and/or Clinic Website Info First');
    }

    if (vendastaAccountId && !reputationManagement && !listings) {
      sendingValuesDelete.integrations.push({
        type: 'vendasta',
        options: 'deleteAll',
      });
    } else if (vendastaAccountId) {
      const optionsCreate = {
        type: 'vendasta',
        options: 'add',
      };

      const optionsDelete = {
        type: 'vendasta',
        options: 'delete',
      };

      optionsCreate.reputationManagement = !vendastaSrId && reputationManagement;
      optionsCreate.listings = !vendastaMsId && listings;
      optionsDelete.reputationManagement = vendastaSrId && !reputationManagement;
      optionsDelete.listings = vendastaMsId && !listings;

      if (optionsCreate.reputationManagement || optionsCreate.listings) {
        sendingValuesCreate.integrations.push(optionsCreate);
      }

      if (optionsDelete.reputationManagement || optionsDelete.listings) {
        sendingValuesDelete.integrations.push(optionsDelete);
      }
    } else if (!vendastaAccountId && (reputationManagement || listings)) {
      sendingValuesCreate.integrations.push({
        type: 'vendasta',
        options: 'createAdd',
        reputationManagement,
        listings,
      });
    }

    if (canSendReminders && !twilioPhoneNumber) {
      sendingValuesCreate.integrations.push({
        type: 'twilio',
        options: 'create',
      });
    }

    if (!canSendReminders && twilioPhoneNumber) {
      sendingValuesDelete.integrations.push({
        type: 'twilio',
        options: 'delete',
      });
    }

    if (callTracking && !callrailId) {
      sendingValuesCreate.integrations.push({
        type: 'callrail',
        options: 'create',
      });
    }

    if (!callTracking && callrailId) {
      sendingValuesDelete.integrations.push({
        type: 'callrail',
        options: 'delete',
      });
    }

    if (sendingValuesCreate.integrations[0]) {
      await this.props.createEntityRequest({
        key: 'accounts',
        url: `/api/accounts/${activeAccount.id}/integrations`,
        entityData: sendingValuesCreate,
      });
    }

    if (sendingValuesDelete.integrations[0]) {
      await this.props.deleteEntityRequest({
        key: 'accounts',
        url: `/api/accounts/${activeAccount.id}/integrations`,
        values: sendingValuesDelete,
      });
    }
    return null;
  }

  openPreviewModal() {
    this.setState({
      previewOpen: !this.state.previewOpen,
    });
  }

  render() {
    const { activeAccount, users } = this.props;

    if (!activeAccount) return null;

    const token = localStorage.getItem('token');
    const decodedToken = jwt(token);
    let role = null;
    users.forEach((user) => {
      if (decodedToken.userId === user.id) {
        role = user.role;
      }
      return null;
    });

    const addAccounts = [
      <Header title="API Accounts" contentHeader />,
      <div className={styles.formContainer}>
        <AddAccounts onSubmit={this.updateApis} formName="apis" activeAccount={activeAccount} />
      </div>,
    ];

    const massOnlineDate = activeAccount.massOnlineEmailSentDate
      ? moment(activeAccount.massOnlineEmailSentDate).format('MMM DD, YYYY hh:mm A')
      : null;

    const emailTemplate = 'General Introduction Announcement';
    const url = `/api/accounts/${activeAccount.id}/emails/preview/?templateName=${emailTemplate}`;

    const actions = [
      {
        label: 'Cancel',
        onClick: this.openPreviewModal,
        component: Button,
        props: { border: 'blue' },
      },
      {
        label: 'Send Email Blast',
        onClick: this.sendEmailBlast,
        component: Button,
        props: { color: 'blue' },
      },
    ];

    return (
      role === 'SUPERADMIN' && (
        <SettingsCard title="Super Admin" bodyClass={styles.generalBodyClass}>
          <Header title="Practice Settings" contentHeader />
          <div className={styles.formContainer}>
            <SuperAdminForm onSubmit={this.updateAdminForm} activeAccount={activeAccount} />
          </div>

          {addAccounts}

          <MassEmailDisplay
            massOnlineDate={massOnlineDate}
            openPreviewModal={this.openPreviewModal}
            activeAccount={activeAccount}
            getEmailBlastCount={this.props.getEmailBlastCount}
          />

          <DialogBox
            title="Email Blast Preview"
            actions={actions}
            active={this.state.previewOpen}
            onEscKeyDown={this.openPreviewModal}
            onOverlayClick={this.openPreviewModal}
            bodyStyles={styles.modalBody}
          >
            <EmailPreview url={url} />
          </DialogBox>
        </SettingsCard>
      )
    );
  }
}

SuperAdmin.propTypes = {
  activeAccount: PropTypes.instanceOf(Account).isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
  createEntityRequest: PropTypes.func.isRequired,
  deleteEntityRequest: PropTypes.func.isRequired,
  fetchEntities: PropTypes.func.isRequired,
  sendEmailBlast: PropTypes.func.isRequired,
  getEmailBlastCount: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(PropTypes.instanceOf(User)).isRequired,
};

function mapStateToProps({ entities, auth }) {
  const activeAccount = entities.getIn(['accounts', 'models', auth.get('accountId')]);

  const addresses = entities.getIn(['addresses', 'models']);
  let address;
  if (activeAccount && activeAccount.addressId) {
    address = addresses.get(activeAccount.addressId);
  }

  return {
    activeAccount,
    address,
    users: entities.getIn(['users', 'models']),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchEntities,
      downloadConnector,
      sendEmailBlast,
      getEmailBlastCount,
      createEntityRequest,
      deleteEntityRequest,
      updateEntityRequest,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SuperAdmin);
