
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NewPatientForm from './NewPatientForm';
import { Card, CardHeader } from '../../library';
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
    } = this.props;

    const {
      requestData,
      patientUser,
    } = mergingPatientData;

    values.isSyncedWithPMS = false;
    values.patientUserId = patientUser.id;

    const modifiedRequest = {
      startDate: requestData.startDate,
      endDate: requestData.endDate,
      serviceId: requestData.serviceId,
      note: requestData.note,
      isSyncedWithPMS: false,
      customBufferTime: 0,
      requestModel: requestData.requestModel,
      request: true,
    };

    this.props.createEntityRequest({
      key: 'patients',
      entityData: values,
    }).then((result) => {
      const newPatientId = Object.keys(result.patients)[0];
      modifiedRequest.patientId = newPatientId;
      this.props.reinitializeState();
      this.props.selectAppointment(requestAppoinment);
    });
  }

  render() {
    const {
      mergingPatientData,
    } = this.props;

    return (
      <Card>
        <CardHeader
          className={styles.header}
          title="Create New Patient"
        />
        <div className={styles.formContainer}>
          <NewPatientForm
            mergingPatientData={mergingPatientData}
            formName="Create New Patient"
            onSubmit={this.handleSubmit}
          />
        </div>
      </Card>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    createEntityRequest,
    //reset,
  }, dispatch);
};

const enhance = connect(null, mapDispatchToProps)
export default enhance(AddPatientUser);
