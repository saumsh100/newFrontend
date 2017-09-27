
import React, {PropTypes, Component} from 'react';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { connect } from 'react-redux';
import GeneralForm from './GeneralForm';
import ContactForm from './ContactForm';
import SuperAdminForm from './SuperAdminForm';
import Address from '../Address';
import { Map } from 'immutable';
import { updateEntityRequest, fetchEntities } from '../../../../thunks/fetchEntities';
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
      console.log(matches);

      const now = moment(Number(matches[1]) * 1000);
      console.log(now)
      const end = moment(new Date());
      const duration = moment.duration(now.diff(end));

      console.log(duration.asSeconds());

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

      let button = <Button onClick={this.downloadConnector}>Download Connector</Button>;

      if (this.state.downloadLink) {
        const now = moment(this.state.expired);
        const end = moment(new Date());
        const duration = moment.duration(now.diff(end)).asSeconds();

        const timeLeft = duration > 0 ? `Link Expires in ${duration} s` : 'Link Expired';

        button = <a className={styles.linkAsButton} href={this.state.downloadLink} download>{timeLeft}</a>;

        setTimeout(() => {
          if (duration > 0) {
            this.setState({ expired: this.state.expired });
          }
        }, 100);
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
  fetchEntities: PropTypes.func,
  uploadLogo: PropTypes.func,
  deleteLogo: PropTypes.func,
  downloadConnector: PropTypes.func,
};

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    updateEntityRequest,
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
