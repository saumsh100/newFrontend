
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { connect } from 'react-redux';
import jwt from 'jwt-decode';
import GeneralForm from './GeneralForm';
import AddAccounts from './AddAccounts';
import ContactForm from './ContactForm';
import SuperAdminForm from './SuperAdminForm';
import Address from '../Address';
import {
  updateEntityRequest,
  fetchEntities,
  createEntityRequest,
  deleteEntityRequest,
} from '../../../../thunks/fetchEntities';
import {
  uploadLogo,
  deleteLogo,
  downloadConnector,
  sendEmailBlast,
  getEmailBlastCount,
} from '../../../../thunks/accounts';
import EmailPreview from '../../Shared/EmailPreview';
import { Dropzone, AccountLogo, Button, Header, DialogBox } from '../../../library';
import SettingsCard from '../../Shared/SettingsCard';
import MassEmailDisplay from './MassEmailDisplay';
import styles from './styles.scss';

class General extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
      downloadLink: null,
      expired: null,
      previewOpen: false,
      emailCount: 0,
      displayedCount: false,
    };

    this.updateName = this.updateName.bind(this);
    this.uploadLogo = this.uploadLogo.bind(this);
    this.deleteLogo = this.deleteLogo.bind(this);
    this.deleteAccounts = this.deleteAccounts.bind(this);
    this.updateApis = this.updateApis.bind(this);
    this.downloadConnector = this.downloadConnector.bind(this);
    this.sendEmailBlast = this.sendEmailBlast.bind(this);
    this.openPreviewModal = this.openPreviewModal.bind(this);
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    const decodedToken = jwt(token);
    const url = `/api/users/${decodedToken.userId}`;

    this.props.fetchEntities({ url });
  }

  downloadConnector() {
    this.props.downloadConnector().then((downloadLink) => {
      const reg = /Expires=([^&]*)/;
      const matches = downloadLink.match(reg);

      this.setState({
        downloadLink,
        expired: Number(matches[1] * 1000),
      });
    });
  }

  uploadLogo(files) {
    this.setState({
      uploading: true,
    });

    this.props.uploadLogo(this.props.activeAccount.id, files[0]).then(() => {
      this.setState({
        uploading: false,
      });
    });
  }

  deleteAccounts() {
    const { activeAccount } = this.props;
    this.props.createEntityRequest({
      url: `/api/accounts/${activeAccount.id}/integrations`,
      params: {},
    });
  }

  async updateApis(values) {
    const { activeAccount, address } = this.props;
    const { reputationManagement, listings, callTracking, canSendReminders } = values;

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

    const { city, state, country, zipCode, street, timezone } = address;

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
  }

  sendEmailBlast() {
    const { activeAccount } = this.props;

    if (activeAccount.massOnlineEmailSentDate) {
      return alert('Sorry but you have already performed this email campaign.');
    }

    const sendEmails = confirm('Are you sure you want to send this email blast?');
    const sendEmailsForSure = sendEmails && confirm('Are you really sure?');

    if (sendEmailsForSure) {
      this.setState({
        previewOpen: false,
      });
      this.props.sendEmailBlast(activeAccount.id);
    }
  }

  deleteLogo() {
    this.props.deleteLogo(this.props.activeAccount.id);
  }

  updateName(values) {
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

    this.props.updateEntityRequest({ key: 'accounts', model: modifiedAccount, alert });
  }

  openPreviewModal() {
    this.setState({
      previewOpen: !this.state.previewOpen,
    });
  }

  render() {
    const { activeAccount, users } = this.props;

    if (!activeAccount) return null;

    const addAccounts = [
      <Header title="API Accounts" contentHeader />,
      <div className={styles.formContainer}>
        <AddAccounts onSubmit={this.updateApis} formName="apis" activeAccount={activeAccount} />
      </div>,
    ];

    const token = localStorage.getItem('token');
    const decodedToken = jwt(token);
    let role = null;
    users.map((users) => {
      if (decodedToken.userId === users.id) {
        role = users.role;
      }
      return null;
    });

    let button = <Button onClick={this.downloadConnector}>Generate Download Link</Button>;

    if (this.state.downloadLink) {
      const now = moment(this.state.expired);
      const end = moment(new Date());
      const duration = moment.duration(now.diff(end)).asSeconds();

      button =
        duration > 0 ? (
          <a className={styles.linkAsButton} href={this.state.downloadLink} download>
            Click to Download
            <br /> {Math.floor(duration)} s
          </a>
        ) : (
          <a className={styles.linkAsButton} href={this.state.downloadLink} download>
            Link Expired
          </a>
        );

      setTimeout(() => {
        if (duration > 0) {
          this.setState({ expired: this.state.expired });
        }
      }, 500);
    }

    const massOnlineDate = activeAccount.massOnlineEmailSentDate
      ? moment(activeAccount.massOnlineEmailSentDate).format('MMM DD, YYYY hh:mm A')
      : null;

    const url = `/api/accounts/${
      activeAccount.id
    }/emails/preview/?templateName=Online Booking Introduction`;

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
      <SettingsCard title="General" bodyClass={styles.generalBodyClass}>
        <div className={styles.generalMainContainer}>
          <div className={styles.formContainer}>
            <Header title="Clinic Details" contentHeader />
            <GeneralForm role={role} onSubmit={this.updateName} activeAccount={activeAccount} />
          </div>
          <div className={styles.drop}>
            <Header title="Logo" contentHeader />
            <Dropzone onDrop={this.uploadLogo} loaded={!this.state.uploading}>
              <AccountLogo account={activeAccount} size="original" />
              <p>Drop logo here or click to select file.</p>
            </Dropzone>
            {activeAccount.fullLogoUrl ? (
              <Button icon="trash" className={styles.deleteLogo} onClick={this.deleteLogo}>
                Remove Logo
              </Button>
            ) : null}
          </div>
        </div>
        <Header title="Contact Information" contentHeader />
        <div className={styles.formContainer}>
          <ContactForm role={role} onSubmit={this.updateName} activeAccount={activeAccount} />
        </div>
        <Header title="Address Information" contentHeader />
        <div className={styles.formContainer}>
          <Address activeAccount={activeAccount} />
        </div>
        <Header title="Download Connector" contentHeader />
        <div className={styles.formContainer}>
          <div className={styles.buttonContainer}>{button}</div>
        </div>
        {role === 'SUPERADMIN' && (
          <MassEmailDisplay
            massOnlineDate={massOnlineDate}
            openPreviewModal={this.openPreviewModal}
            activeAccount={activeAccount}
            getEmailBlastCount={this.props.getEmailBlastCount}
          />
        )}

        {role === 'SUPERADMIN' ? <Header title="Administrative Information" contentHeader /> : null}

        <div className={styles.formContainer}>
          {role === 'SUPERADMIN' ? (
            <SuperAdminForm role={role} onSubmit={this.updateName} activeAccount={activeAccount} />
          ) : null}
        </div>

        {role === 'SUPERADMIN' ? addAccounts : null}

        {role === 'SUPERADMIN' && (
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
        )}
      </SettingsCard>
    );
  }
}

General.propTypes = {
  activeAccount: PropTypes.objectOf(PropTypes.any),
  users: PropTypes.objectOf(PropTypes.any),
  updateEntityRequest: PropTypes.func,
  createEntityRequest: PropTypes.func,
  deleteEntityRequest: PropTypes.func,
  fetchEntities: PropTypes.func,
  uploadLogo: PropTypes.func,
  deleteLogo: PropTypes.func,
  downloadConnector: PropTypes.func,
  sendEmailBlast: PropTypes.func,
  getEmailBlastCount: PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      updateEntityRequest,
      createEntityRequest,
      deleteEntityRequest,
      fetchEntities,
      uploadLogo,
      deleteLogo,
      downloadConnector,
      sendEmailBlast,
      getEmailBlastCount,
    },
    dispatch
  );
}

function mapStateToProps({ entities, auth }) {
  const activeAccount = entities.getIn(['accounts', 'models', auth.get('accountId')]);
  const addresses = entities.getIn(['addresses', 'models']);
  let address;
  if (activeAccount && activeAccount.addressId) {
    address = addresses.get(activeAccount.addressId);
  }

  return {
    users: entities.getIn(['users', 'models']),
    activeAccount,
    address,
  };
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(General);
