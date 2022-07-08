import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import GeneralForm from './GeneralForm';
import Address from './Address';
import DisplayName from './DisplayName';

import { updateEntityRequest, fetchEntities } from '../../../../thunks/fetchEntities';
import { uploadLogo, deleteLogo } from '../../../../thunks/accounts';
import { Dropzone, AccountLogo, StandardButton as Button, Header, Icon } from '../../../library';
import { validateNoSpace } from '../../../library/Form/validate';
import SettingsCard from '../../Shared/SettingsCard';
import styles from './styles.scss';

class General extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
    };

    this.updatePracticeData = this.updatePracticeData.bind(this);
    this.uploadLogo = this.uploadLogo.bind(this);
    this.deleteLogo = this.deleteLogo.bind(this);
  }

  componentDidMount() {
    const url = `/api/users/${this.props.userId}`;

    this.props.fetchEntities({ url });
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
    const notificationEmailsArr = values.notificationEmails.split(',').map((val) => val.trim());
    const valuesMap = Map({
      ...values,
      phoneNumber: values.phoneNumber ? validateNoSpace(values.phoneNumber) : null,
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
    const { activeAccount, users, userId } = this.props;

    if (!activeAccount) return null;
    const PracticeDetailsInitValues = {
      name: activeAccount.get('name'),
      website: activeAccount.get('website'),
      phoneNumber: activeAccount.get('phoneNumber'),
      contactEmail: activeAccount.get('contactEmail'),
      facebookUrl: activeAccount.get('facebookUrl'),
      unit: activeAccount.get('unit'),
      notificationEmails: activeAccount.get('notificationEmails')
        ? activeAccount.get('notificationEmails').join(', ')
        : '',
      useNotificationEmails: activeAccount.get('useNotificationEmails'),
    };
    let role = null;
    users.forEach((user) => {
      if (userId === user.id) {
        role = user.role;
      }
      return null;
    });

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
              activeAccount={activeAccount}
            />
          </div>
          <div className={styles.drop}>
            <Header title="Logo" contentHeader />
            <Dropzone onDrop={this.uploadLogo} loaded={!this.state.uploading}>
              <AccountLogo account={activeAccount} size="original" />
              <div className={styles.mainText}>
                <Icon icon="cloud-upload" className={styles.cloudIcon} />
                <p className={styles.title}>
                  Drag and Drop your logo here or click to select file.
                </p>
              </div>
            </Dropzone>
            {activeAccount.fullLogoUrl && (
              <Button className={styles.deleteLogo} onClick={this.deleteLogo} variant="secondary">
                Remove Logo
              </Button>
            )}
          </div>
        </div>
        <Header title="Address Information" contentHeader />
        <div className={styles.formContainer}>
          <Address activeAccount={activeAccount} />
        </div>
        <Header contentHeader title="Patient Name Preference" key="Patient Name Preference" />
        <div className={styles.formContainer} key="Patient Name Preference">
          <DisplayName role={role} />
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
  userId: PropTypes.string.isRequired,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      updateEntityRequest,
      fetchEntities,
      uploadLogo,
      deleteLogo,
    },
    dispatch,
  );
}

function mapStateToProps({ entities, auth }) {
  const activeAccount = entities.getIn(['accounts', 'models', auth.get('accountId')]);
  const addresses = entities.getIn(['addresses', 'models']);
  const checkAccount = activeAccount && activeAccount.addressId;
  const address = checkAccount ? addresses.get(activeAccount.addressId) : null;

  return {
    users: entities.getIn(['users', 'models']),
    activeAccount,
    address,
    timezone: activeAccount.timezone,
    userId: auth.get('userId'),
  };
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(General);
