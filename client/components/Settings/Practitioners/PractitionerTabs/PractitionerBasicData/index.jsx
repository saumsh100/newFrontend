
import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PractitionerAvatar, Form, Field, Dropzone, Header, Button } from '../../../../library';
import { uploadAvatar, deleteAvatar } from '../../../../../thunks/practitioners';
import styles from '../../styles.scss';

const maxLength = max => value =>
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

  uploadAvatar(files) {
    this.setState({
      uploading: true,
    });

    this.props.uploadAvatar(this.props.practitioner.id, files[0]);
  }

  deleteAvatar() {
    this.props.deleteAvatar(this.props.practitioner.id);
  }

  componentWillReceiveProps(props) {
    if (this.props.practitioner.avatarUrl !== props.practitioner.avatarUrl) {
      this.setState({
        uploading: false,
      });
    }
  }

  updatePractitioner(values) {
    const { practitioner } = this.props;

    values.firstName = values.firstName.trim();
    values.lastName = values.lastName.trim();

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
      isActive: practitioner.get('isActive'),
      type: practitioner.get('type'),
    };

    return (
      <div className={styles.practFormContainer}>
        <Header title="Avatar" />
        <Dropzone onDrop={this.uploadAvatar} loaded={!this.state.uploading}>
          <PractitionerAvatar practitioner={initialValues} size="extralg" />
          <p>Drop avatar here or click to select file.</p>
        </Dropzone>
        {initialValues.fullAvatarUrl ? <Button className={styles.deleteAvatar} onClick={this.deleteAvatar}>Remove Avatar</Button> : null}

        <Header title="Personal Details" />
        <Form
          form={`${practitioner.get('id')}Form`}
          onSubmit={this.updatePractitioner}
          initialValues={initialValues}
        >
          <Field
            required
            name="firstName"
            label="First Name"
            validate={[maxLength25]}
          />
          <Field
            required
            name="lastName"
            label="Last Name"
            validate={[maxLength25]}
          />
          <div className={styles.practFormContainer_type}>
            <Field
              name="type"
              label="Practitioner Type"
              component="DropdownSelect"
              options={[
                { value: 'Dentist' },
                { value: 'Hygenist' },
              ]}
            />
          </div>
          <div className={styles.practFormContainer_practActive}>
            Active?
            <div className={styles.practFormContainer_practActive_toggle}>
              <Field
                name="isActive"
                component="Toggle"
              />
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    uploadAvatar,
    deleteAvatar,
  }, dispatch);
}

PractitionerBasicData.propTypes = {
  practitioner: PropTypes.object.required,
}

export default connect(mapStateToProps, mapDispatchToProps)(PractitionerBasicData);

