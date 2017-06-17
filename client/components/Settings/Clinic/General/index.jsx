
import React, {PropTypes, Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import GeneralForm from './GeneralForm';
import Address from '../Address';
import { Map } from 'immutable';
import { updateEntityRequest } from '../../../../thunks/fetchEntities';
import { uploadLogo, deleteLogo } from '../../../../thunks/accounts';
import { Grid, Row, Col, Dropzone, AccountLogo, Button, Header} from '../../../library';
import styles from './styles.scss';

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
              <AccountLogo account={activeAccount} size="extralg" />
              <p>Drop logo here or click to select file.</p>
            </Dropzone>
            {activeAccount.fullLogoUrl ? <Button className={styles.deleteLogo} onClick={this.deleteLogo}>Remove Logo</Button> : null}
          </div>

          <GeneralForm
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
  updateEntityRequest: PropTypes.func,
  uploadLogo: PropTypes.func,
  deleteLogo: PropTypes.func,
};

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    updateEntityRequest,
    uploadLogo,
    deleteLogo,
  }, dispatch);
}

function mapStateToProps({ entities, auth }) {
  return {
    activeAccount: entities.getIn(['accounts', 'models', auth.get('accountId')]),
  };
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(General);
