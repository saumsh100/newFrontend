
import React, {PropTypes, Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import GeneralForm from './GeneralForm';
import Address from '../Address';
import { Map } from 'immutable';
import { updateEntityRequest } from '../../../../thunks/fetchEntities';
import { Grid, Row, Col, Header} from '../../../library';
import styles from './styles.scss';

class General extends React.Component {

  constructor(props) {
    super(props);
    this.updateName = this.updateName.bind(this);
  }

  updateName(values) {
    const { activeAccount, updateEntityRequest } = this.props;
    const valuesMap = Map(values);
    const modifiedAccount = activeAccount.merge(valuesMap);
    const alert = { success: 'Updated Clinic Information', error: 'Clinic Information Update Failed' };
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
};

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    updateEntityRequest,
  }, dispatch);
}

function mapStateToProps({ entities }) {
  return {
    activeAccount: entities.getIn(['accounts', 'models']).first(),
  };
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(General);
