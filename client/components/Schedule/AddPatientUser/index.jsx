
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NewPatientForm from './NewPatientForm';
import { Card, CardHeader, Icon } from '../../library';
import { change } from 'redux-form';
import styles from './styles.scss';
import { createEntityRequest } from '../../../thunks/fetchEntities';

class AddPatientUser extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    const {
      mergingPatientData,
      reinitializeState,
      selectAppointment,
      createEntityRequest,
    } = this.props;

    const {
      requestData,
      patientUser,
    } = mergingPatientData;

    const phoneNumber = values.phoneNumber;

    values.isSyncedWithPMS = false;
    values.patientUserId = patientUser.id;
    values.mobilePhoneNumber = phoneNumber;

    const appointment = {
      startDate: requestData.startDate,
      endDate: requestData.endDate,
      serviceId: requestData.serviceId,
      note: requestData.note,
      isSyncedWithPMS: false,
      customBufferTime: 0,
      requestModel: requestData.requestModel,
      request: true,
      practitionerId: requestData.practitionerId,
    };

    createEntityRequest({
      key: 'patients',
      entityData: values,
    }).then((result) => {
      const newPatientId = Object.keys(result.patients)[0];
      appointment.patientId = newPatientId;
      reinitializeState();
      selectAppointment(appointment);
    });
  }

  render() {
    const {
      mergingPatientData,
      reinitializeState,
    } = this.props;

    return (
      <Card className={styles.cardContainer}>
        <CardHeader
          className={styles.header}
          title="Create New Patient"
        >
        <Icon
          icon="times"
          onClick={reinitializeState}
          className={styles.trashIcon}
        />
        </CardHeader>
        <div className={styles.formContainer}>
          <NewPatientForm
            mergingPatientData={mergingPatientData}
            formName="Create New Patient"
            onSubmit={this.handleSubmit}
            handleDatePicker={this.handleDatePicker}
          />
        </div>
      </Card>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    createEntityRequest,
    change,
    //reset,
  }, dispatch);
};

const enhance = connect(null, mapDispatchToProps)
export default enhance(AddPatientUser);
