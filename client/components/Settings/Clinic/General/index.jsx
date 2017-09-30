
import React, {PropTypes, Component} from 'react';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { connect } from 'react-redux';
import GeneralForm from './GeneralForm';
import AddAccounts from './AddAccounts';
import ContactForm from './ContactForm';
import SuperAdminForm from './SuperAdminForm';
import Address from '../Address';
import { Map } from 'immutable';
import { updateEntityRequest, fetchEntities, createEntityRequest, deleteEntityRequest } from '../../../../thunks/fetchEntities';
import { uploadLogo, deleteLogo, downloadConnector } from '../../../../thunks/accounts';
import { Grid, Row, Col, Dropzone, AccountLogo, Button, Header} from '../../../library';
import styles from './styles.scss';
import jwt from 'jwt-decode';

class General extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
      downloadLink: null,
      expired: null,
    };

    this.updateName = this.updateName.bind(this);
    this.uploadLogo = this.uploadLogo.bind(this);
    this.deleteLogo = this.deleteLogo.bind(this);
    this.deleteAccounts = this.deleteAccounts.bind(this);
    this.updateApis = this.updateApis.bind(this);
    this.downloadConnector = this.downloadConnector.bind(this);
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    const decodedToken = jwt(token);
    const url = `/api/users/${decodedToken.userId}`;

    this.props.fetchEntities({ url });
  }

  downloadConnector() {
    this.props.downloadConnector()
    .then((downloadLink) => {
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

    this.props.uploadLogo(this.props.activeAccount.id, files[0])
    .then(() => {
      this.setState({
        uploading: false,
      });
    });
  }

  deleteAccounts() {
    console.log('asdsads')
    const { activeAccount, createEntityRequest } = this.props;
    createEntityRequest({ url: `/api/accounts/${activeAccount.id}/integrations`, params: {} });
  }

  async updateApis(values) {
    const { activeAccount, createEntityRequest, deleteEntityRequest } = this.props;
    const {
      reputationManagement,
      listings,
      callTracking,
      canSendReminders,
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
      city,
      state,
      country,
      zipCode,
      street,
      timezone,
      website,
    } = activeAccount;

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
      await createEntityRequest({ key: 'accounts', url: `/api/accounts/${activeAccount.id}/integrations`, entityData: sendingValuesCreate });
    }

    if (sendingValuesDelete.integrations[0]) {
      await deleteEntityRequest({ key: 'accounts', url: `/api/accounts/${activeAccount.id}/integrations`, values: sendingValuesDelete });
    }
  }

  deleteLogo() {
    this.props.deleteLogo(this.props.activeAccount.id);
  }

  updateName(values) {
    const { activeAccount, updateEntityRequest } = this.props;
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
    updateEntityRequest({ key: 'accounts', model: modifiedAccount, alert });
  }

  render() {
    const { activeAccount, users } = this.props;

    const addAccounts = [(<Header
      title="API Accounts"
      contentHeader
    />), (<div className={styles.formContainer}>
      <AddAccounts
        onSubmit={this.updateApis}
        formName="apis"
        activeAccount={activeAccount}
      />
    </div>)];

    let showComponent = null;
    if (activeAccount) {
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

        button = duration > 0 ? (<a
          className={styles.linkAsButton}
          href={this.state.downloadLink}
          download
        >Click to Download
          <br /> {Math.floor(duration)} s
        </a>) : (<a
          className={styles.linkAsButton}
          href={this.state.downloadLink}
          download
        >Link Expired
        </a>);

        setTimeout(() => {
          if (duration > 0) {
            this.setState({ expired: this.state.expired });
          }
        }, 500);
      }

      showComponent = (
        <div className={styles.outerContainer}>
          <Header
            title="General"
            className={styles.generalHeader}
          />
          <div className={styles.generalMainContainer}>
            <div className={styles.formContainer}>
              <Header
                title="Clinic Details"
                contentHeader
              />
              <GeneralForm
                role={role}
                onSubmit={this.updateName}
                activeAccount={activeAccount}
              />
            </div>
            <div className={styles.drop}>
              <Header
                title="Logo"
                contentHeader
              />
              <Dropzone onDrop={this.uploadLogo} loaded={!this.state.uploading}>
                <AccountLogo account={activeAccount} size="original" />
                  <p>Drop logo here or click to select file.</p>
              </Dropzone>
              {activeAccount.fullLogoUrl ? <Button icon="trash" className={styles.deleteLogo} onClick={this.deleteLogo}>Remove Logo</Button> : null}
            </div>
          </div>
          <Header
            title="Contact Information"
            contentHeader
          />
          <div className={styles.formContainer}>
            <ContactForm
              role={role}
              onSubmit={this.updateName}
              activeAccount={activeAccount}
            />
          </div>
          <Header
            title="Address Information"
            contentHeader
          />
          <div className={styles.formContainer}>
            <Address
              activeAccount={activeAccount}
            />
          </div>
          <Header
            title="Download Connector"
            contentHeader
          />
          <div className={styles.formContainer}>
            {button}
          </div>
          {role === 'SUPERADMIN' ? <Header
            title="Administrative Information"
            contentHeader
          /> : null }

          <div className={styles.formContainer}>
            {role === 'SUPERADMIN' ? <SuperAdminForm
              role={role}
              onSubmit={this.updateName}
              activeAccount={activeAccount}
            /> : null }
          </div>

          {role === 'SUPERADMIN' ? addAccounts : null }
        </div>
      );
    }

    return (
      <div>
        {showComponent}
      </div>
    );
  }
}

General.propTypes = {
  activeAccount: PropTypes.object,
  users: PropTypes.object,
  updateEntityRequest: PropTypes.func,
  createEntityRequest: PropTypes.func,
  deleteEntityRequest: PropTypes.func,
  fetchEntities: PropTypes.func,
  uploadLogo: PropTypes.func,
  deleteLogo: PropTypes.func,
  downloadConnector: PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateEntityRequest,
    createEntityRequest,
    deleteEntityRequest,
    fetchEntities,
    uploadLogo,
    deleteLogo,
    downloadConnector,
  }, dispatch);
}

function mapStateToProps({ entities, auth }) {
  return {
    users: entities.getIn(['users', 'models']),
    activeAccount: entities.getIn(['accounts', 'models', auth.get('accountId')]),
  };
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(General);
