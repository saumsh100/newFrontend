
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { change } from 'redux-form';
import { Map } from 'immutable';
import AddressForm from './AddressForm';
import { updateEntityRequest, createEntityRequest } from '../../../../../thunks/fetchEntities';
import accountShape from '../../../../library/PropTypeShapes/accountShape';

class Address extends Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  submit(values) {
    const { activeAccount } = this.props;
    values.city = values.city && values.city.trim();
    values.street = values.street && values.street.trim();
    const valuesMap = Map(values);
    const modifiedAccount = activeAccount.merge(valuesMap);
    const alert = {
      success: { body: 'Updated Address Information' },
      error: { body: 'Address Information Update Failed' },
    };

    this.props
      .updateEntityRequest({
        key: 'accounts',
        model: modifiedAccount,
        alert,
      })
      .then(() => {
        if (activeAccount.addressId) {
          values.accountId = activeAccount.id;
          this.props.updateEntityRequest({
            key: 'addresses',
            values,
            url: `/api/addresses/${activeAccount.addressId}`,
          });
        } else {
          this.props.createEntityRequest({
            key: 'addresses',
            values,
            url: '/api/addresses/',
          });
        }
      })
      .then(() => {
        if (values.timezone !== activeAccount.timezone) {
          window.location.reload();
        }
      });
  }

  render() {
    const { activeAccount, address } = this.props;
    return (
      address && (
        <AddressForm
          onSubmit={this.submit}
          accountInfo={activeAccount}
          address={address}
          change={this.props.change}
        />
      )
    );
  }
}

Address.propTypes = {
  activeAccount: PropTypes.shape(accountShape).isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
  createEntityRequest: PropTypes.func.isRequired,
  address: PropTypes.shape({
    country: PropTypes.string,
    street: PropTypes.string,
    city: PropTypes.string,
    zipCode: PropTypes.string,
    state: PropTypes.string,
    timezone: PropTypes.string,
  }),
  change: PropTypes.func.isRequired,
};

Address.defaultProps = { address: null };

function mapDispatchToActions(dispatch) {
  return bindActionCreators(
    {
      updateEntityRequest,
      createEntityRequest,
      change,
    },
    dispatch,
  );
}

function mapStateToProps({ entities }, { activeAccount }) {
  const addresses = entities.getIn(['addresses', 'models']);

  return {
    address:
      activeAccount && activeAccount.addressId ? addresses.get(activeAccount.addressId) : false,
  };
}

const enhance = connect(
  mapStateToProps,
  mapDispatchToActions,
);
export default enhance(Address);
