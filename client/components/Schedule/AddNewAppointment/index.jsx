
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Map } from 'immutable';
import { change, reset } from 'redux-form';
import { setTime } from '../../library/util/TimeOptions';
import DisplayForm from './DisplayForm';
import RemoteSubmitButton from '../../library/Form/RemoteSubmitButton';
import {
  fetchEntities,
  createEntityRequest,
  updateEntityRequest,
  deleteEntityRequest,
  fetchEntitiesRequest,
} from '../../../thunks/fetchEntities';
import {
  Button,
  Avatar,
  Card,
  SContainer,
  SFooter,
  SHeader,
  SBody,
  Icon,
} from '../../library';
import styles from './styles.scss';

const mergeTime = (date, time) => {
  date.setHours(time.getHours());
  date.setMinutes(time.getMinutes());
  return new Date(date);
};
const getDuration = (startDate, endDate, customBufferTime) => {
  const end = moment(endDate);
  const duration = moment.duration(end.diff(startDate));
  return duration.asMinutes() - customBufferTime;
};

class AddNewAppointment extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAutoSuggest = this.handleAutoSuggest.bind(this);
    this.deleteAppointment = this.deleteAppointment.bind(this);
    this.handleDurationChange = this.handleDurationChange.bind(this);
    this.handleUnitChange = this.handleUnitChange.bind(this);
    this.handleStartTimeChange = this.handleStartTimeChange.bind(this);
    this.handleEndTimeChange = this.handleEndTimeChange.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const currentDate = moment(this.props.currentDate);

    const nextPropsDate = moment(nextProps.currentDate);

    if (!nextPropsDate.isSame(currentDate)) {
      this.props.change(this.props.formName, 'date', nextPropsDate);
    }
  }

  getSuggestions(value) {
    return this.props.fetchEntitiesRequest({ url: '/api/patients/search', params: { patients: value } })
      .then((searchData) => searchData.patients).then((searchedPatients) => {
        const patientList = Object.keys(searchedPatients).length ? Object.keys(searchedPatients).map(
          key => searchedPatients[key]) : [];

        patientList.map((patient) => {
          patient.display = (
            <div className={styles.suggestionContainer}>
              <Avatar user={patient} size="xs" />
              <div className={styles.suggestionContainer_details}>
                <div className={styles.suggestionContainer_fullName}>
                  {`${patient.firstName} ${patient.lastName}${patient.birthDate ? `, ${moment().diff(patient.birthDate, 'years')}` : ''}`}
                </div>
                <div className={styles.suggestionContainer_date}>
                  Last Appointment {patient.lastApptDate ? moment(patient.lastApptDate).format('MMM D YYYY') : 'n/a'}
                </div>
              </div>
            </div>
          );
        });
        return patientList;
      });
  }

  handleStartTimeChange(value) {
    const {
      appFormValues,
      formName,
      unit,
      change,
    } = this.props;

    if (appFormValues && appFormValues.endTime) {
      const duration = getDuration(value, appFormValues.endTime, 0);
      const unitValue = unit ? Number((duration / unit).toFixed(2)) : 0;
      change(formName, 'duration', duration);
      change(formName, 'unit', unitValue);
    }
  }

  handleEndTimeChange(value) {
    const {
      appFormValues,
      unit,
      formName,
      change,
    } = this.props;

    if (appFormValues && appFormValues.startTime) {
      const duration = getDuration(appFormValues.startTime, value, 0);
      const unitValue = unit ? Number((duration / unit).toFixed(2)) : 0;
      change(formName, 'duration', duration);
      change(formName, 'unit', unitValue);
    }
  }

  handleDurationChange(value) {
    const {
      change,
      formName,
      unit,
      appFormValues,
    } = this.props;

    if (appFormValues && appFormValues.startTime) {
      const time = moment(appFormValues.startTime).add(value, 'minutes');
      change(formName, 'endTime', setTime(time));
    } else {
      let startTime = moment();
      startTime.seconds(0);

      if (startTime.minutes() % unit) {
        startTime = startTime.minutes(Math.floor(startTime.minutes() / unit) * unit);
      }

      const endTime = moment(startTime).add(value, 'minutes');

      if (!value % unit) {
        change(formName, 'endTime', setTime(endTime));
      }

      if (!value) {
        change(formName, 'endTime', '');
      }
      change(formName, 'startTime', setTime(startTime));
    }

    change(formName, 'unit', (value / unit).toFixed(2));
  }

  handleUnitChange(value) {
    const {
      change,
      formName,
      unit,
      appFormValues,
    } = this.props;

    const duration = value * unit;

    if (duration >= unit) {
      if (appFormValues && appFormValues.startTime) {
        const time = moment(appFormValues.startTime).add(duration, 'minutes');
        change(formName, 'endTime', setTime(time));
      } else {
        let startTime = moment();
        startTime.seconds(0);

        if (startTime.minutes() % unit) {
          startTime = startTime.minutes(Math.floor(startTime.minutes() / unit) * unit);
        }

        const endTime = moment(startTime).add(duration, 'minutes');

        change(formName, 'startTime', setTime(startTime));
        change(formName, 'endTime', setTime(endTime));
      }

      change(formName, 'duration', duration);
    }
  }

  handleAutoSuggest(newValue) {
    if (typeof newValue === 'object') {
      this.props.setPatientSearched(newValue);
      this.props.setShowInput(false);
    } else if (newValue === '') {
      this.props.setPatientSearched('');
    }
  }

  handleSubmit(values) {
    const {
      selectedAppointment,
      createEntityRequest,
      updateEntityRequest,
      reinitializeState,
      reset,
      formName,
    } = this.props;

    const {
      date,
      startTime,
      practitionerId,
      chairId,
      isPatientConfirmed,
      isCancelled,
      duration,
      note,
      patientSelected,
    } = values;

    const startDate = mergeTime(new Date(date), new Date(startTime));
    const endDate = moment(startDate).add(duration, 'minutes');

    const newAppointment = {
      startDate,
      endDate,
      patientId: patientSelected.id,
      practitionerId,
      chairId,
      note,
      isPatientConfirmed,
      isCancelled,
      isSyncedWithPms: false,
    };


    const alertCreate = {
      success: {
        body: `Added a new Appointment for ${patientSelected.firstName}`,
      },
      error: {
        body: 'Appointment Creation Failed',
      },
    };

    const alertUpdate = {
      success: {
        body: `Updated ${patientSelected.firstName}'s Appointment`,
      },
      error: {
        body: `Appointment Update for ${patientSelected.firstName} Failed`,
      },
    };

    const alertRequestUpdate = {
      success: {
        body: `Request Confirmed for ${patientSelected.firstName}'s Appointment`,
      },
      error: {
        body: `Request failed for ${patientSelected.firstName} Failed`,
      },
    };

    // if an appointment is not selected then create the appointment else update the appointment
    if (!selectedAppointment || (selectedAppointment && selectedAppointment.request)) {
      const requestId = selectedAppointment ? selectedAppointment.requestModel.get('id') : null;

      return createEntityRequest({
        key: 'appointments',
        entityData: newAppointment,
        alert: alertCreate,
      }).then((data) => {
        if (selectedAppointment && selectedAppointment.request) {
          return updateEntityRequest({
            key: 'requests',
            model: selectedAppointment.requestModel,
            alert: alertRequestUpdate,
          }).then(() => {
            this.props.updateEntityRequest({
              url: `/api/requests/${requestId}/confirm/${Object.keys(data.appointments)[0]}`,
              values: {},
            })
              .then(() => {
                reinitializeState();
                reset(formName);
              });
          });
        } else {
          reinitializeState();
          reset(formName);
        }
      });

    }

    const appModel = selectedAppointment.appModel;
    const appModelSynced = appModel.set('isSyncedWithPms', false);
    const valuesMap = Map(newAppointment);
    const modifiedAppointment = appModelSynced.merge(valuesMap);

    return updateEntityRequest({
      key: 'appointments',
      model: modifiedAppointment,
      alert: alertUpdate,
    }).then(() => {
      reinitializeState();
    });
  }

  deleteAppointment() {
    const {
      selectedAppointment,
      reinitializeState,
      updateEntityRequest,
    } = this.props;

    const deleteApp = confirm('Are you sure you want to delete this appointment?');

    if (deleteApp) {
      const delModel = Map({
        isDeleted: true,
        isSyncedWithPms: false,
      });
      const appModel = selectedAppointment.appModel;
      const deletedModel = appModel.merge(delModel);
      updateEntityRequest({ key: 'appointments', model: deletedModel });
    }

    reinitializeState();
  }

  render() {
    const {
      formName,
      patients,
      chairs,
      practitioners,
      selectedAppointment,
      reinitializeState,
      unit,
      currentDate,
    } = this.props;

    const remoteButtonProps = {
      onClick: reinitializeState,
      form: formName,
    };
    let title = selectedAppointment && !selectedAppointment.request ? 'Edit Appointment' : 'Add Appointment';
    let buttonTitle = selectedAppointment && !selectedAppointment.request ? 'Edit' : 'Add';

    if (selectedAppointment && selectedAppointment.request) {
      title = 'Accept Appointment';
      buttonTitle = 'Add';
    }

    return (
      <Card className={styles.formContainer} noBorder>
        <SContainer>
          <SHeader className={styles.header}>
            <div>{title}</div>
            <div
              className={styles.close}
              onClick={() => {
                this.props.reset(formName);
                this.props.reinitializeState();
              }}
            >
              <Icon icon="times" />
            </div>
          </SHeader>
          <SBody className={styles.body}>
            <DisplayForm
              key={formName}
              formName={formName}
              practitioners={practitioners}
              patients={patients}
              chairs={chairs}
              selectedAppointment={selectedAppointment}
              unit={unit}
              getSuggestions={this.getSuggestions}
              handleSubmit={this.handleSubmit}
              handleAutoSuggest={this.handleAutoSuggest}
              handleDurationChange={this.handleDurationChange}
              handleUnitChange={this.handleUnitChange}
              handleStartTimeChange={this.handleStartTimeChange}
              handleEndTimeChange={this.handleEndTimeChange}
              title={title}
              reinitializeState={reinitializeState}
              currentDate={currentDate}
              showInput={this.props.showInput}
              setShowInput={this.props.setShowInput}
              setCreatingPatient={this.props.setCreatingPatient}
              patientSearched={this.props.patientSearched}
              setPatientSearched={this.props.setPatientSearched}
              change={this.props.change}
              reset={this.props.reset}
            />
          </SBody>
          <SFooter className={styles.footer}>
            <div className={styles.button_cancel}>
              <Button
                onClick={() => {
                  this.props.reset(formName);
                  this.props.reinitializeState();
                }}
                border="blue"
              >
                Cancel
              </Button>
            </div>
            <RemoteSubmitButton
              {...remoteButtonProps}
              color="blue"
            >
              {buttonTitle}
            </RemoteSubmitButton>
          </SFooter>
        </SContainer>
      </Card>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    fetchEntitiesRequest,
    createEntityRequest,
    updateEntityRequest,
    deleteEntityRequest,
    reset,
    change,
  }, dispatch);
}


function mapStateToProps({ form }, { formName }) {
  if (!form[formName]) {
    return {
      values: {},
    };
  }

  return {
    appFormValues: form[formName].values,
  };
}

AddNewAppointment.propTypes = {
  formName: PropTypes.string.isRequired,
  services: PropTypes.object.isRequired,
  patients: PropTypes.object.isRequired,
  chairs: PropTypes.array,
  practitioners: PropTypes.object.isRequired,
  weeklySchedule: PropTypes.object,
  unit: PropTypes.number,
  selectedAppointment: PropTypes.object,
  deleteEntityRequest: PropTypes.func,
  reset: PropTypes.func,
  change: PropTypes.func,
  reinitializeState: PropTypes.func,
  fetchEntities: PropTypes.func,
  updateEntityRequest: PropTypes.func,
};

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(AddNewAppointment);
