
import React, {PropTypes, Component} from 'react';
import AddressForm  from './AddressForm';
import { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateEntityRequest } from '../../../../thunks/fetchEntities';


class Address extends React.Component {

  constructor(props){
    super(props);
    this.submit = this.submit.bind(this);
  }

  submit(values) {
    const { activeAccount, updateEntityRequest } = this.props;
    const valuesMap = Map(values);
    const modifiedAccount =activeAccount.merge(valuesMap);
    updateEntityRequest({ key: 'accounts', model: modifiedAccount });
  }

  render(){
    const { activeAccount } = this.props;

    let showComponent = null;
    if (activeAccount) {
      showComponent = (
        <AddressForm
          onSubmit={this.submit}
          accountInfo={activeAccount}
        />
      );
    }
    return (
      <div>
        {showComponent}
      </div>
    );
  }

}

Address.propTypes = {
  activeAccount: PropTypes.props,
  updateEntityRequest: PropTypes.func,
}

function mapDispatchToActions(dispatch){
  return bindActionCreators({
    updateEntityRequest,
  },dispatch);
}

const enhance = connect(null, mapDispatchToActions)
export default enhance(Address);