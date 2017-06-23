
import React, {PropTypes, Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import GeneralForm from './GeneralForm';
import Address from '../Address';
import { Map } from 'immutable';
import { updateEntityRequest, fetchEntities } from '../../../../thunks/fetchEntities';
import { uploadLogo, deleteLogo } from '../../../../thunks/accounts';
import { Grid, Row, Col, Dropzone, AccountLogo, Button, Header} from '../../../library';
import styles from './styles.scss';
import jwt from 'jwt-decode';

class General extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
    };

    this.updateName = this.updateName.bind(this);
    this.uploadLogo = this.uploadLogo.bind(this);
    this.deleteLogo = this.deleteLogo.bind(this);
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    const decodedToken = jwt(token);
    const url = `/api/users/${decodedToken.userId}`;

    this.props.fetchEntities({ url });
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
    const { activeAccount } = this.props;

    let showComponent = null;
    if (activeAccount) {
      showComponent = (
        <div style={{ display: 'inlineBlock' }}>
          <Header
            title="Basic"
            className={styles.generalHeader}
          />
          <div className={styles.drop}>
            <Dropzone onDrop={this.uploadLogo} loaded={!this.state.uploading}>
              <AccountLogo account={activeAccount} size="original" />
              <p>Drop logo here or click to select file.</p>
            </Dropzone>
            {activeAccount.fullLogoUrl ? <Button className={styles.deleteLogo} onClick={this.deleteLogo}>Remove Logo</Button> : null}
          </div>

          <GeneralForm
            users={this.props.users}
            onSubmit={this.updateName}
            activeAccount={activeAccount}
          />
          <Header
            title="Address"
            className={styles.generalHeader}
          />
          <Address
            activeAccount={activeAccount}
          />
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
};

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    updateEntityRequest,
    fetchEntities,
    uploadLogo,
    deleteLogo,
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
