import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Form, Field, Tooltip, Icon } from '../../../library';
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
    super(props);
    this.state = props;
    this.handleDisplayNameSubmit = this.handleDisplayNameSubmit.bind(this);
  }

  handleDisplayNameSubmit(values) {
    if (
      window.confirm(
        'Are you sure you want to change the preference name in which Donna will use for patient communication?',
      )
    ) {
      this.setState({ ...values });

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
        enableReinitialize
        form="displayNameForm"
        initialValues={this.state}
        destroyOnUnmount
        values={this.state}
        onSubmit={this.handleDisplayNameSubmit}
        alignSave="left"
      >
        <div className={styles.descriptionMessage}>
          Set the way you would like Donna to communicate with your patients{' '}
          {this.props.role !== 'OWNER' && this.props.role !== 'SUPERADMIN' ? (
            <Tooltip
              trigger={['hover']}
              overlay={
                <div className={styles.tooltipWrapper}>
                  <div className={styles.tooltipBodyRow}>
                    Please contact your account owner or the Support team to edit this.
                  </div>
                </div>
              }
              placement="top"
            >
              <span>
                <Icon icon="question-circle" size={0.9} />
              </span>
            </Tooltip>
          ) : null}
        </div>
        <Field
          name="displayNameOption"
          label="Patient Name Preference"
          component="DropdownSelect"
          options={nameOptions}
          disabled={this.props.role !== 'OWNER' && this.props.role !== 'SUPERADMIN'}
        />
      </Form>
    );
  }
}

DisplayName.propTypes = {
  updateEntityRequest: PropTypes.func.isRequired,
  activeAccount: PropTypes.instanceOf(Account).isRequired,
  role: PropTypes.string,
};
DisplayName.defaultProps = {
  role: '',
};
const mapStateToProps = ({ entities, auth }) => {
  const activeAccount = entities.getIn(['accounts', 'models', auth.get('accountId')]);
  const displayNameOption = activeAccount.get('displayNameOption') || 'firstName';

  return {
    activeAccount,
    displayNameOption,
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({ updateEntityRequest }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DisplayName);
