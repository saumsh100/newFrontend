
import React, {PropTypes, Component} from 'react';
import GeneralForm from './GeneralForm';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateEntityRequest } from '../../../../thunks/fetchEntities';


class General extends React.Component {

  constructor(props) {
    super(props);
    this.updateName = this.updateName.bind(this);
  }

  updateName(values) {
    const {activeAccount, updateEntityRequest} = this.props;
    const modifiedAccount = activeAccount.set('name', values.name);
    updateEntityRequest({ key: 'accounts', model: modifiedAccount });
  }

  render() {
    const { activeAccount } = this.props;

    let showComponent = null;
    if (activeAccount) {
      showComponent = (
        <GeneralForm
          onSubmit={this.updateName}
          accountInfo={activeAccount}
        />);
    }

    return (
      <div>
        {showComponent}
      </div>
    );
  }
}

General.propTypes = {
  activeAccount: PropTypes.props,
  updateEntityRequest: PropTypes.func,
}


function mapDispatchToProps(dispatch){
  return bindActionCreators({
    updateEntityRequest,
  }, dispatch);
}

const enhance = connect(null, mapDispatchToProps);

export default enhance(General);