
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { connect } from 'react-redux';
import jwt from 'jwt-decode';
import GeneralForm from './GeneralForm';
import Address from './Address';
import { updateEntityRequest, fetchEntities } from '../../../../thunks/fetchEntities';
import { uploadLogo, deleteLogo, downloadConnector } from '../../../../thunks/accounts';
import { Dropzone, AccountLogo, Button, Header, Link } from '../../../library';
import SettingsCard from '../../Shared/SettingsCard';
import styles from './styles.scss';

class General extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
      downloadLink: null,
      expired: null,
    };

    this.updatePracticeData = this.updatePracticeData.bind(this);
    this.uploadLogo = this.uploadLogo.bind(this);
    this.deleteLogo = this.deleteLogo.bind(this);
    this.downloadConnector = this.downloadConnector.bind(this);
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
    this.setState({ uploading: true });

    this.props.uploadLogo(this.props.activeAccount.id, files[0]).then(() => {
      this.setState({ uploading: false });
    });
  }

  deleteLogo() {
    this.props.deleteLogo(this.props.activeAccount.id);
  }

  updatePracticeData(values) {
    const { activeAccount } = this.props;
    const notificationEmailsArr = values.notificationEmails.split(',').map(val => val.trim());
    const valuesMap = Map({
      ...values,
      notificationEmails: notificationEmailsArr,
    });
    const modifiedAccount = activeAccount.merge(valuesMap);
    const alert = {
      success: { body: 'Updated Practice Information' },
      error: {
        title: 'Practice Information Error',
        body: 'Failed to update.',
      },
    };

    this.props.updateEntityRequest({
      key: 'accounts',
      model: modifiedAccount,
      alert,
    });
  }

  render() {
    const { activeAccount, users } = this.props;

    if (!activeAccount) return null;
    const PracticeDetailsInitValues = {
      name: activeAccount.get('name'),
      website: activeAccount.get('website'),
      phoneNumber: activeAccount.get('phoneNumber'),
      contactEmail: activeAccount.get('contactEmail'),
      notificationEmails: activeAccount.get('notificationEmails')
        ? activeAccount.get('notificationEmails').join(', ')
        : '',
      useNotificationEmails: activeAccount.get('useNotificationEmails'),
    };
    const token = localStorage.getItem('token');
    const decodedToken = jwt(token);
    let role = null;
    users.forEach((user) => {
      if (decodedToken.userId === user.id) {
        role = user.role;
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
          <Link className={styles.linkAsButton} href={this.state.downloadLink} download>
            Click to Download
            <br /> {Math.floor(duration)} s
          </Link>
        ) : (
          <Link className={styles.linkAsButton} href={this.state.downloadLink} download>
            Link Expired
          </Link>
        );

      setTimeout(() => {
        if (duration > 0) {
          this.setState({ expired: this.state.expired });
        }
      }, 500);
    }

    return (
      <SettingsCard title="General" bodyClass={styles.generalBodyClass}>
        <div className={styles.generalMainContainer}>
          <div className={styles.formContainer}>
            <Header title="Practice Details" contentHeader />
            <GeneralForm
              enableReinitialize
              form="PracticeDetailsForm123"
              initialValues={PracticeDetailsInitValues}
              onSubmit={this.updatePracticeData}
              role={role}
            />
          </div>
          <div className={styles.drop}>
            <Header title="Logo" contentHeader />
            <Dropzone onDrop={this.uploadLogo} loaded={!this.state.uploading}>
              <AccountLogo account={activeAccount} size="original" />
              <p>Drop logo here or click to select file.</p>
            </Dropzone>
            {activeAccount.fullLogoUrl && (
              <Button className={styles.deleteLogo} onClick={this.deleteLogo}>
                Remove Logo
              </Button>
            )}
          </div>
        </div>
        <Header title="Address Information" contentHeader />
        <div className={styles.formContainer}>
          <Address activeAccount={activeAccount} />
        </div>
        <Header title="Download Connector" contentHeader />
        <div className={styles.formContainer}>
          <div className={styles.buttonContainer}>{button}</div>
        </div>
      </SettingsCard>
    );
  }
}

General.defaultProps = {
  activeAccount: null,
  users: null,
};

General.propTypes = {
  activeAccount: PropTypes.objectOf(PropTypes.any),
  users: PropTypes.objectOf(PropTypes.any),
  updateEntityRequest: PropTypes.func.isRequired,
  fetchEntities: PropTypes.func.isRequired,
  uploadLogo: PropTypes.func.isRequired,
  deleteLogo: PropTypes.func.isRequired,
  downloadConnector: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      updateEntityRequest,
      fetchEntities,
      uploadLogo,
      deleteLogo,
      downloadConnector,
    },
    dispatch,
  );
}

function mapStateToProps({ entities, auth }) {
  const activeAccount = entities.getIn(['accounts', 'models', auth.get('accountId')]);
  const addresses = entities.getIn(['addresses', 'models']);

  const address =
    activeAccount && activeAccount.addressId ? addresses.get(activeAccount.addressId) : null;

  return {
    users: entities.getIn(['users', 'models']),
    activeAccount,
    address,
  };
}

const enhance = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default enhance(General);
