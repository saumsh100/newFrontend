import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  PractitionerAvatar,
  Form,
  Field,
  Dropzone,
  Header,
  Button,
  Icon,
} from '../../../../library';
import { uploadAvatar, deleteAvatar } from '../../../../../thunks/practitioners';
import { practitionerShape } from '../../../../library/PropTypeShapes';
import styles from '../../styles.scss';

const maxLength = (max) => (value) =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined;
const maxLength25 = maxLength(25);

class PractitionerBasicData extends Component {
  constructor(props) {
    super(props);
    this.updatePractitioner = this.updatePractitioner.bind(this);
    this.uploadAvatar = this.uploadAvatar.bind(this);
    this.deleteAvatar = this.deleteAvatar.bind(this);
    this.state = {
      uploading: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.practitioner.avatarUrl !== prevProps.practitioner.avatarUrl) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        uploading: false,
      });
    }
  }

  uploadAvatar(files) {
    this.setState({
      uploading: true,
    });
    this.props.uploadAvatar(this.props.practitioner.id, files[0]);
  }

  deleteAvatar() {
    this.props.deleteAvatar(this.props.practitioner.id);
  }

  updatePractitioner(values) {
    const { practitioner } = this.props;
    values.firstName = values && values.firstName && values.firstName.trim();
    values.lastName = values && values.lastName && values.lastName.trim();
    const valuesMap = Map(values);
    const modifiedPractitioner = practitioner.merge(valuesMap);
    const alert = {
      success: {
        body: `${values.firstName}'s information updated.`,
      },
      error: {
        body: `${values.firstName}'s information update failed.`,
      },
    };
    this.props.updatePractitioner(modifiedPractitioner, alert);
  }

  render() {
    const { practitioner } = this.props;
    if (!practitioner) {
      return null;
    }

    const initialValues = {
      firstName: practitioner.get('firstName'),
      lastName: practitioner.get('lastName'),
      fullAvatarUrl: practitioner.get('fullAvatarUrl'),
      type: practitioner.get('type'),
      isHidden: practitioner.get('isHidden'),
    };

    return (
      <div className={styles.practFormContainer}>
        <Form
          enableReinitialize
          form={`${practitioner.get('id')}Form`}
          onSubmit={this.updatePractitioner}
          initialValues={initialValues}
          data-test-id="practitionerBasicDataForm"
        >
          <div className={styles.practFormContainer_basicForm}>
            <Header title="Personal Details" contentHeader />
            <Field
              required
              name="firstName"
              label="First Name"
              validate={[maxLength25]}
              data-test-id="firstName"
            />
            <Field
              name="lastName"
              label="Last Name"
              validate={[maxLength25]}
              data-test-id="lastName"
            />
            <Field
              name="type"
              label="Practitioner Type"
              component="DropdownSelect"
              options={[
                { value: 'CDA' },
                { value: 'Dentist' },
                { value: 'Hygienist' },
                { value: 'Specialist' },
              ]}
            />
            <div className={styles.practFormContainer_practHidden}>
              <span className={styles.practFormContainer_practHidden_text}>
                {`Would you like to set this practitioner to be hidden on the booking
                widget?`}
              </span>
              <div className={styles.practFormContainer_practHidden_hiddenToggle}>
                <Field name="isHidden" component="Toggle" />
              </div>
            </div>
          </div>
        </Form>
        <div className={styles.practFormContainer_avatarContainer}>
          <Header title="Avatar" contentHeader />
          <Dropzone onDrop={this.uploadAvatar} loaded={!this.state.uploading}>
            <PractitionerAvatar practitioner={initialValues} size="xl" />
            <div className={styles.mainText}>
              <Icon icon="cloud-upload" className={styles.cloudIcon} />
              <p className={styles.title}>
                Drag and Drop your avatar here or click to select file.
              </p>
            </div>
          </Dropzone>
          {initialValues.fullAvatarUrl && (
            <Button className={styles.deleteAvatar} onClick={this.deleteAvatar}>
              Remove Avatar
            </Button>
          )}
        </div>
      </div>
    );
  }
}
function mapStateToProps() {
  return {};
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      uploadAvatar,
      deleteAvatar,
    },
    dispatch,
  );
}

PractitionerBasicData.propTypes = {
  practitioner: PropTypes.shape(practitionerShape).isRequired,
  deleteAvatar: PropTypes.func.isRequired,
  uploadAvatar: PropTypes.func.isRequired,
  updatePractitioner: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(PractitionerBasicData);
