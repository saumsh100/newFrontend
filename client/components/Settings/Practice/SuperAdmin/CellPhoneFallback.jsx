
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Form, Field } from '../../../library';
import { updateEntityRequest } from '../../../../thunks/fetchEntities';
import Account from '../../../../entities/models/Account';
import styles from './styles.scss';

const cellPhoneOptions = [
  {
    value: 'mobilePhoneNumber',
    label: 'Mobile Phone',
  },
  {
    value: 'otherPhoneNumber',
    label: 'Other Phone',
  },
  {
    value: 'homePhoneNumber',
    label: 'Home Phone',
  },
  {
    value: 'workPhoneNumber',
    label: 'Work Phone',
  },
];

const orderOptions = [
  {
    label: 'Disabled',
    value: '',
  },
  {
    label: '1st',
    value: 0,
  },
  {
    label: '2nd',
    value: 1,
  },
  {
    label: '3rd',
    value: 2,
  },
  {
    label: '4th',
    value: 3,
  },
];

class CellPhoneFallback extends React.Component {
  constructor(props) {
    super();

    const order = cellPhoneOptions.reduce(
      (acc, { value }) => ({
        ...acc,
        [value]:
          props.cellPhoneNumberFallback.indexOf(value) === -1
            ? ''
            : props.cellPhoneNumberFallback.indexOf(value),
      }),
      {},
    );

    this.state = { order };
    this.handleOrderSubmit = this.handleOrderSubmit.bind(this);
  }

  handleOrderSubmit(values) {
    if (
      window.confirm('Are you sure you want to change the order in which Donna will look for a cell phone number?')
    ) {
      const finalOrder = Object.entries(values)
        .filter(([, value]) => value !== '')
        .sort(([, a], [, b]) => (a > b ? 1 : -1))
        .map(([key]) => key);

      const { activeAccount } = this.props;
      const modifiedAccount = activeAccount.merge({ cellPhoneNumberFallback: finalOrder });

      const alert = {
        success: { body: 'Cell Phone Number Order Preferences Updated' },
        error: {
          Title: 'Preferences Error',
          body: 'Cell Phone Number Order Update Failed',
        },
      };

      this.props.updateEntityRequest({
        key: 'accounts',
        model: modifiedAccount,
        alert,
      });
    }
  }

  render() {
    const initialValues = this.state.order;
    return (
      <Form
        form="cellPhoneNumberFallback"
        initialValues={initialValues}
        destroyOnUnmount={false}
        values={this.state.order}
        onSubmit={this.handleOrderSubmit}
        alignSave="left"
      >
        <p className={styles.descriptionMessage}>
          Select the order in how Donna will look for a cell phone number from the existing phone
          number fields we pull from the Practice Management Software.
        </p>
        {cellPhoneOptions.map(({ label, value }) => (
          <Field
            key={value}
            name={value}
            label={label}
            component="DropdownSelect"
            options={orderOptions}
            data-test-id={value}
          />
        ))}
      </Form>
    );
  }
}

CellPhoneFallback.propTypes = {
  updateEntityRequest: PropTypes.func.isRequired,
  activeAccount: PropTypes.instanceOf(Account).isRequired,
  cellPhoneNumberFallback: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const mapStateToProps = ({ entities, auth }) => {
  const activeAccount = entities.getIn(['accounts', 'models', auth.get('accountId')]);
  return {
    activeAccount,
    cellPhoneNumberFallback: activeAccount.get('cellPhoneNumberFallback').toJS(),
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({ updateEntityRequest }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CellPhoneFallback);
