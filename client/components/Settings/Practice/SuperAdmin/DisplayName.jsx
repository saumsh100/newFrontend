
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Form, Field } from '../../../library';
import { updateEntityRequest } from '../../../../thunks/fetchEntities';
import Account from '../../../../entities/models/Account';
import styles from './styles.scss';

const nameOptions = [
  {
    label: 'First Name',
    value: 'firstName',
  },
  {
    label: 'Preferred Name',
    value: 'prefName',
  },
];

class DisplayName extends React.Component {
  constructor(props) {
    super();

    this.state = props;
    this.handleDisplayNameSubmit = this.handleDisplayNameSubmit.bind(this);
  }

  handleDisplayNameSubmit(values) {
    if (
      window.confirm(
        'Are you sure you want to change the preference name in which Donna will use for patient communication?',
      )
    ) {
      const { activeAccount } = this.props;
      const modifiedAccount = activeAccount.merge(values);

      const alert = {
        success: { body: 'Patient Name Preferences Updated' },
        error: {
          Title: 'Preferences Error',
          body: 'Patient Name Preferences Update Failed',
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
    return (
      <Form
        form="displayNameForm"
        initialValues={this.state}
        destroyOnUnmount={false}
        values={this.state}
        onSubmit={this.handleDisplayNameSubmit}
        alignSave="left"
      >
        <p className={styles.descriptionMessage}>
          Set the way you would like Donna to communicate with your patients
        </p>
        <Field
          name="displayNameOption"
          label="Patient Name Preference"
          component="DropdownSelect"
          options={nameOptions}
        />
      </Form>
    );
  }
}

DisplayName.propTypes = {
  updateEntityRequest: PropTypes.func.isRequired,
  activeAccount: PropTypes.instanceOf(Account).isRequired,
};

const mapStateToProps = ({ entities, auth }) => {
  const activeAccount = entities.getIn(['accounts', 'models', auth.get('accountId')]);
  const displayNameOption = activeAccount.get('displayNameOption') || 'firstName';

  return {
    activeAccount,
    displayNameOption,
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({ updateEntityRequest }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DisplayName);
