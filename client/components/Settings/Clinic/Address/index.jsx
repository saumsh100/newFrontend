
import React, { PropTypes, Component } from 'react';
import { reset } from 'redux-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import AddressForm from './AddressForm';
import { updateEntityRequest, createEntityRequest } from '../../../../thunks/fetchEntities';
import styles from './styles.scss';
import { Grid } from '../../../library';


class Address extends React.Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  submit(values) {
    const { activeAccount, updateEntityRequest, createEntityRequest } = this.props;
    values.city = values.city.trim();
    values.street = values.street.trim();
    const valuesMap = Map(values);
    const modifiedAccount = activeAccount.merge(valuesMap);
    const alert = {
      success: {
        body: 'Updated Address Information',
      },
      error: {
        body: 'Address Information Update Failed',
      },
    };

    updateEntityRequest({ key: 'accounts', model: modifiedAccount, alert });
    if (activeAccount.addressId) {
      values.accountId = activeAccount.id;
      updateEntityRequest({ key: 'addresses', values, url: `/api/addresses/${activeAccount.addressId}` })
      .then(() => this.props.reset('addressSettingsForm'));
    } else {
      createEntityRequest({ key: 'addresses', values, url: '/api/addresses/' })
      .then(() => this.props.reset('addressSettingsForm'));
    }
  }

  render() {
    const { activeAccount, addresses } = this.props;
    let showComponent = null;
    if (activeAccount) {

      let address = null;
      if (activeAccount.addressId) {
        address = addresses.get(activeAccount.addressId);
      }

      showComponent = (
        <AddressForm
          onSubmit={this.submit}
          accountInfo={activeAccount}
          address={address}
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
  activeAccount: PropTypes.object,
  addresses: PropTypes.object,
  updateEntityRequest: PropTypes.func,
  reset: PropTypes.func,
};

function mapDispatchToActions(dispatch) {
  console.log(reset)
  return bindActionCreators({
    updateEntityRequest,
    createEntityRequest,
    reset,
  }, dispatch);
}

function mapStateToProps({ entities }) {
  return {
    addresses: entities.getIn(['addresses', 'models']),
  };
}

const enhance = connect(mapStateToProps, mapDispatchToActions);
export default enhance(Address);
