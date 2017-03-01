
import React, {PropTypes, Component} from 'react';
import AddressForm from './AddressForm';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateEntityRequest } from '../../../../thunks/fetchEntities';


class Address extends React.Component {

  constructor(props){
    super(props);
    this.submit = this.submit.bind(this);
  }

  submit(values){

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
}

export default Address;