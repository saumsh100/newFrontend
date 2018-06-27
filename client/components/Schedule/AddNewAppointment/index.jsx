
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Map } from 'immutable';
import { change, reset } from 'redux-form';
import { push } from 'react-router-redux';
import { isHub } from '../../../util/hub';
import Requests from '../../../entities/models/Request';
import { setTime, getDuration } from '../../library/util/TimeOptions';
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
      this.props.changeForm(this.props.formName, 'date', nextPropsDate);
    }
  }

  getSuggestions(value) {
    return this.props
      .fetchEntitiesRequest({
        url: '/api/patients/search',
        params: { patients: value },
      })
      .then(searchData => searchData.patients)
      .then((searchedPatients) => {
        const patientList = Object.keys(searchedPatients).length
          ? Object.keys(searchedPatients).map(key => searchedPatients[key])
          : [];

        return patientList.map((patient) => {
          patient.display = (
            <div className={styles.suggestionContainer}>
              <Avatar user={patient} size="xs" />
              <div className={styles.suggestionContainer_details}>
                <div className={styles.suggestionContainer_fullName}>
                  {`${patient.firstName} ${patient.lastName}${
                    patient.birthDate
                      ? `, ${moment().diff(patient.birthDate, 'years')}`
                      : ''
                  }`}
                </div>
                <div className={styles.suggestionContainer_date}>
                  Last Appointment:{' '}
                  {patient.lastApptDate
                    ? moment(patient.lastApptDate).format('MMM D YYYY')
                    : 'n/a'}
                </div>
              </div>
            </div>
          );
          return patient;
        });
      });
  }

  handleStartTimeChange(value) {
    const {
      appFormValues, formName, unit, changeForm,
    } = this.props;
    const defaultDuration = appFormValues ? appFormValues.duration : 60;
    const endTime = moment(value).add(defaultDuration, 'minutes');
    changeForm(formName, 'endTime', setTime(endTime));
    const duration = getDuration(value, endTime, 0);
    const unitValue = unit ? Number((duration / unit).toFixed(2)) : 0;
    changeForm(formName, 'duration', duration);
    changeForm(formName, 'unit', unitValue);
  }

  handleEndTimeChange(value) {
    const {
      appFormValues, unit, formName, changeForm,
    } = this.props;

    if (appFormValues && appFormValues.startTime) {
      const duration = getDuration(appFormValues.startTime, value, 0);
      const unitValue = unit ? Number((duration / unit).toFixed(2)) : 0;
      changeForm(formName, 'duration', duration);
      changeForm(formName, 'unit', unitValue);
    }
  }

  handleDurationChange(value) {
    const {
      changeForm, formName, unit, appFormValues,
    } = this.props;

    if (appFormValues && appFormValues.startTime) {
      const time = moment(appFormValues.startTime).add(value, 'minutes');
      changeForm(formName, 'endTime', setTime(time));
    } else {
      let startTime = moment();
      startTime.seconds(0);

      if (startTime.minutes() % unit) {
        startTime = startTime.minutes(Math.floor(startTime.minutes() / unit) * unit);
      }

      const endTime = moment(startTime).add(value, 'minutes');

      if (!value % unit) {
        changeForm(formName, 'endTime', setTime(endTime));
      }

      if (!value) {
        changeForm(formName, 'endTime', '');
      }
      changeForm(formName, 'startTime', setTime(startTime));
    }

    changeForm(formName, 'unit', (value / unit).toFixed(2));
  }

  handleUnitChange(value) {
    const {
      changeForm, formName, unit, appFormValues,
    } = this.props;

    const duration = value * unit;

    if (duration >= unit) {
      if (appFormValues && appFormValues.startTime) {
        const time = moment(appFormValues.startTime).add(duration, 'minutes');
        changeForm(formName, 'endTime', setTime(time));
      } else {
        let startTime = moment();
        startTime.seconds(0);

        if (startTime.minutes() % unit) {
          startTime = startTime.minutes(Math.floor(startTime.minutes() / unit) * unit);
        }

        const endTime = moment(startTime).add(duration, 'minutes');

        changeForm(formName, 'startTime', setTime(startTime));
        changeForm(formName, 'endTime', setTime(endTime));
      }

      changeForm(formName, 'duration', duration);
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
      reinitializeState,
      formName,
      redirect,
      setLocation,
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

    if (redirect) {
      setLocation(redirect);
    }

    // if an appointment is not selected then create the appointment else update the appointment
    if (
      !selectedAppointment ||
      (selectedAppointment && selectedAppointment.request)
    ) {
      const requestId = selectedAppointment
        ? selectedAppointment.requestModel.get('id')
        : null;

      return this.props
        .createEntityRequest({
          key: 'appointments',
          entityData: newAppointment,
          alert: alertCreate,
        })
        .then((data) => {
          if (selectedAppointment && selectedAppointment.request) {
            return this.props
              .updateEntityRequest({
                key: 'requests',
                model: selectedAppointment.requestModel,
                alert: alertRequestUpdate,
              })
              .then(() => {
                this.props
                  .updateEntityRequest({
                    url: `/api/requests/${requestId}/confirm/${
                      Object.keys(data.appointments)[0]
                    }`,
                    values: {},
                  })
                  .then(() => {
                    reinitializeState();
                    this.props.reset(formName);
                  });
              });
          }
          reinitializeState();
          this.props.reset(formName);
          return null;
        });
    }

    const appModel = selectedAppointment.appModel;
    const appModelSynced = appModel.set('isSyncedWithPms', false);
    const valuesMap = Map(newAppointment);
    const modifiedAppointment = appModelSynced.merge(valuesMap);

    return this.props
      .updateEntityRequest({
        key: 'appointments',
        model: modifiedAppointment,
        alert: alertUpdate,
      })
      .then(() => {
        reinitializeState();
      });
  }

  deleteAppointment() {
    const { selectedAppointment, reinitializeState } = this.props;

    const deleteApp = window.confirm('Are you sure you want to delete this appointment?');

    if (deleteApp) {
      const delModel = Map({
        isDeleted: true,
        isSyncedWithPms: false,
      });
      const appModel = selectedAppointment.appModel;
      const deletedModel = appModel.merge(delModel);
      this.props.updateEntityRequest({
        key: 'appointments',
        model: deletedModel,
      });
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

    let title =
      selectedAppointment && !selectedAppointment.request
        ? 'Edit Appointment'
        : 'Add Appointment';
    let buttonTitle =
      selectedAppointment && !selectedAppointment.request ? 'Save' : 'Add';

    if (selectedAppointment && selectedAppointment.request) {
      title = 'Accept Appointment';
      buttonTitle = 'Add';
    }

    return (
      <Card className={styles.formContainer} noBorder>
        <SContainer>
          {!isHub() && (
            <SHeader className={styles.header}>
              <div>{title}</div>
              <Button
                className={styles.close}
                onClick={() => {
                  this.props.reset(formName);
                  this.props.reinitializeState();
                }}
              >
                <Icon icon="times" />
              </Button>
            </SHeader>
          )}
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
              change={this.props.changeForm}
              reset={this.props.reset}
            />
          </SBody>
          <SFooter className={styles.footer}>
            {!isHub() && (
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
            )}
            <RemoteSubmitButton {...remoteButtonProps} color="blue">
              {buttonTitle}
            </RemoteSubmitButton>
          </SFooter>
        </SContainer>
      </Card>
    );
  }
}

const patientShape = {
  accountId: PropTypes.string,
  email: PropTypes.string,
  firstApptId: PropTypes.string,
  firstName: PropTypes.string,
  gender: PropTypes.string,
  id: PropTypes.string,
  isDeleted: PropTypes.bool,
  isFetching: PropTypes.bool,
  isSyncedWithPms: PropTypes.bool,
  lastName: PropTypes.string,
  lastUpdated: PropTypes.number,
  mobilePhoneNumber: PropTypes.string,
  patientUserId: PropTypes.string,
  status: PropTypes.string,
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchEntities,
      fetchEntitiesRequest,
      createEntityRequest,
      updateEntityRequest,
      deleteEntityRequest,
      reset,
      changeForm: change,
      setLocation: push,
    },
    dispatch,
  );

const mapStateToProps = ({ form }, { formName }) =>
  (!form[formName]
    ? {
      values: {},
    }
    : {
      appFormValues: form[formName].values,
    });

AddNewAppointment.propTypes = {
  appFormValues: PropTypes.shape({
    chairId: PropTypes.string,
    date: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.objectOf(PropTypes.any),
    ]),
    duration: PropTypes.number,
    endTime: PropTypes.string,
    note: PropTypes.string,
    patientSelected: PropTypes.oneOfType([
      PropTypes.shape(patientShape),
      PropTypes.string,
    ]),
    practitionerId: PropTypes.string,
    serviceId: PropTypes.string,
    startTime: PropTypes.string,
    unit: PropTypes.number,
  }),
  chairs: PropTypes.instanceOf(Map).isRequired,
  changeForm: PropTypes.func.isRequired,
  createEntityRequest: PropTypes.func.isRequired,
  currentDate: PropTypes.instanceOf(moment).isRequired,
  deleteEntityRequest: PropTypes.func.isRequired,
  fetchEntities: PropTypes.func.isRequired,
  fetchEntitiesRequest: PropTypes.func.isRequired,
  formName: PropTypes.string.isRequired,
  patientSearched: PropTypes.shape(patientShape),
  patients: PropTypes.instanceOf(Map).isRequired,
  practitioners: PropTypes.instanceOf(Map).isRequired,
  redirect: PropTypes.shape({ pathname: PropTypes.string }),
  reinitializeState: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  selectedAppointment: PropTypes.shape({
    createdAt: PropTypes.string,
    customBufferTime: PropTypes.number,
    endDate: PropTypes.string,
    isSyncedWithPms: PropTypes.bool,
    note: PropTypes.string,
    patientId: PropTypes.string,
    practitionerId: PropTypes.string,
    request: PropTypes.bool,
    requestId: PropTypes.string,
    requestModel: PropTypes.instanceOf(Requests),
    serviceId: PropTypes.string,
    startDate: PropTypes.string,
  }),
  setCreatingPatient: PropTypes.func.isRequired,
  setPatientSearched: PropTypes.func.isRequired,
  setShowInput: PropTypes.func.isRequired,
  setLocation: PropTypes.func.isRequired,
  showInput: PropTypes.bool,
  unit: PropTypes.number,
  updateEntityRequest: PropTypes.func.isRequired,
};

AddNewAppointment.defaultProps = {
  patientSearched: {},
  showInput: true,
  unit: 15,
  selectedAppointment: null,
  redirect: {},
  appFormValues: null,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddNewAppointment);
