import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { reset } from 'redux-form';
import each from 'lodash/each';
import find from 'lodash/find';
import { Header, Button, DialogBox, getFormattedDate } from '../../../library';
import { validateNoSpace } from '../../../library/Form/validate';
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
import Address from '../../../../entities/models/Address';
import ChatSection from '../General/ChatSection';
import CellPhoneFallback from './CellPhoneFallback';
import styles from './styles.scss';
import { showAlertTimeout } from '../../../../thunks/alerts';

class SuperAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = { previewOpen: false };
    this.sendEmailBlast = this.sendEmailBlast.bind(this);
    this.openPreviewModal = this.openPreviewModal.bind(this);
    this.updateApis = this.updateApis.bind(this);
    this.updateAdminForm = this.updateAdminForm.bind(this);
  }

  componentDidMount() {
    const url = `/api/users/${this.props.userId}`;

    this.props.fetchEntities({ url });
  }

  updateAdminForm(values) {
    const { activeAccount } = this.props;
    const newValues = {
      ...values,
      omitChairIds: values.omitChairIdsString ? values.omitChairIdsString.split(',') : [],
      callrailId: values.callrailId || null,
      omitPractitionerIds: values.omitPractitionerIdsString
        ? values.omitPractitionerIdsString.split(',')
        : [],
      destinationPhoneNumber: validateNoSpace(values.destinationPhoneNumber),
    };
    const valuesMap = Map(newValues);
    const modifiedAccount = activeAccount.merge(valuesMap);
    const alert = {
      success: { body: 'Updated Clinic Information' },
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
      this.setState({ previewOpen: false });
      return this.props.sendEmailBlast(activeAccount.id);
    }
    return null;
  }

  async updateApis(values) {
    const { activeAccount, address } = this.props;

    const {
      callrailId,
      callrailIdV3,
      twilioPhoneNumber,
      vendastaAccountId,
      vendastaMsId,
      vendastaSrId,
      website,
    } = activeAccount;

    const { city, state, country, zipCode, street, timezone } = address;

    // Values from AddAccounts...
    const { reputationManagement, listings, callTracking, canSendReminders } = values;

    const sendingValuesCreate = { integrations: [] };
    const sendingValuesDelete = { integrations: [] };

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

    if (callTracking && !callrailId && !callrailIdV3) {
      sendingValuesCreate.integrations.push({
        type: 'callrail',
        options: 'create',
      });
    }

    if (!callTracking && (callrailId || callrailIdV3)) {
      sendingValuesDelete.integrations.push({
        type: 'callrail',
        options: 'delete',
      });
    }

    if (sendingValuesCreate.integrations.length) {
      this.props.showAlertTimeout({
        type: 'success',
        alert: {
          title: 'Service integration requested',
          body: 'Integration in progress, check back in a minute.',
        },
      });

      this.props
        .createEntityRequest({
          key: 'accounts',
          url: `/api/accounts/${activeAccount.id}/integrations`,
          entityData: sendingValuesCreate,
        })
        .then((response) => {
          const entities = getEntities(response);
          const twilioNumber = entities[1].twilioPhoneNumber;
          const callrail = entities[1].callrailId || entities[1].callrailIdV3;
          const { vendastaMsIdEnabled } = entities[1];
          const { vendastaSrIdEnabled } = entities[1];
          const successAPIs = [];
          const failedAPIs = [];
          let successAlert;
          let errorAlert;
          if (find(sendingValuesCreate.integrations, { type: 'twilio' })) {
            if (twilioNumber) successAPIs.push('twilio');
            else failedAPIs.push('twilio');
          }
          if (find(sendingValuesCreate.integrations, { type: 'callrail' })) {
            if (callrail) successAPIs.push('callrail');
            else failedAPIs.push('callrail');
          }

          if (
            find(sendingValuesCreate.integrations, { type: 'vendasta', reputationManagement: true })
          ) {
            if (vendastaSrIdEnabled) successAPIs.push('reputation management');
            else failedAPIs.push('reputation management');
          }
          if (find(sendingValuesCreate.integrations, { type: 'vendasta', listings: true })) {
            if (vendastaMsIdEnabled) successAPIs.push('directory listings');
            else failedAPIs.push('directory listings');
          }

          if (successAPIs.length)
            successAlert = this.props.showAlertTimeout({
              type: 'success',
              alert: {
                body: `Service integration for ${successAPIs.join(', ')} is successful`,
              },
            });
          if (failedAPIs.length)
            errorAlert = this.props.showAlertTimeout({
              type: 'error',
              alert: { body: `Failed to fully enable ${failedAPIs.join(',')} API(s)` },
            });
          this.props.reset('apis');
          return successAlert && errorAlert;
        });
    }
    if (sendingValuesDelete.integrations.length) {
      this.props.showAlertTimeout({
        type: 'success',
        alert: {
          title: 'Service Delete requested',
          body: 'Delete in progress, check back in a minute.',
        },
      });
      this.props
        .deleteEntityRequest({
          key: 'accounts',
          url: `/api/accounts/${activeAccount.id}/integrations`,
          values: sendingValuesDelete,
        })
        .then((response) => {
          this.forceUpdate();

          if (response !== {} || response !== undefined) {
            this.props.showAlertTimeout({
              type: 'success',
              alert: {
                title: 'Success',
                body: 'Service Delete request is successful.',
              },
            });
          } else {
            this.props.showAlertTimeout({
              type: 'error',
              alert: {
                title: 'error',
                body: 'Failed to Delete Service request.',
              },
            });
          }
        });
    }
    return null;
  }

  openPreviewModal() {
    this.setState((prevState) => ({ previewOpen: !prevState.previewOpen }));
  }

  render() {
    const { activeAccount, users, timezone, userId } = this.props;

    if (!activeAccount) return null;

    let role = null;
    users.forEach((user) => {
      if (userId === user.id) {
        role = user.role;
      }
      return null;
    });

    const massOnlineDate = activeAccount.massOnlineEmailSentDate
      ? getFormattedDate(activeAccount.massOnlineEmailSentDate, 'MMM DD, YYYY hh:mm A', timezone)
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
        <SettingsCard title="Global Admin" bodyClass={styles.generalBodyClass}>
          <Header contentHeader title="Practice Settings" key="Practice Settings" />
          <div className={styles.formContainer}>
            <SuperAdminForm onSubmit={this.updateAdminForm} activeAccount={activeAccount} />
          </div>
          <Header contentHeader title="Cell Phone Number Order" key="Cell Phone Number" />
          <div className={styles.formContainer} key="Cell Phone Number Form">
            <CellPhoneFallback />
          </div>

          <>
            <Header title="API Accounts" contentHeader key="API Accounts" />
            <div className={styles.formContainer} key="API Accounts Form">
              <AddAccounts onSubmit={this.updateApis} activeAccount={activeAccount} />
            </div>
          </>

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

          <Header title="Chat" contentHeader />
          <div className={styles.formContainer}>
            <ChatSection activeAccount={activeAccount} />
          </div>
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
  users: PropTypes.instanceOf(Map).isRequired,
  timezone: PropTypes.string.isRequired,
  address: PropTypes.instanceOf(Address),
  reset: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  showAlertTimeout: PropTypes.func.isRequired,
};

SuperAdmin.defaultProps = {
  address: null,
};

const mapStateToProps = ({ entities, auth }) => {
  const activeAccount = entities.getIn(['accounts', 'models', auth.get('accountId')]);

  const addresses = entities.getIn(['addresses', 'models']);
  let timezone = auth.get('timezone');
  let address;
  if (activeAccount && activeAccount.addressId) {
    address = addresses.get(activeAccount.addressId);
    timezone = activeAccount.get('timezone');
  }

  return {
    activeAccount,
    address,
    users: entities.getIn(['users', 'models']),
    timezone,
    userId: auth.get('userId'),
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      fetchEntities,
      downloadConnector,
      sendEmailBlast,
      getEmailBlastCount,
      createEntityRequest,
      reset,
      deleteEntityRequest,
      updateEntityRequest,
      showAlertTimeout,
    },
    dispatch,
  );

function getEntities(entities) {
  const data = [];
  each(entities, (collectionMap) => {
    each(collectionMap, (modelData) => {
      data.push(modelData);
    });
  });
  return data;
}

export default connect(mapStateToProps, mapDispatchToProps)(SuperAdmin);
