
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import omit from 'lodash/omit';
import { reset } from 'redux-form';
import {
  List,
  DialogBox,
  Card,
  CardHeader,
  Icon,
  Button,
  Avatar,
  RemoteSubmitButton,
  getTodaysDate,
} from '../library';
import {
  fetchEntities,
  createEntityRequest,
  updateEntityRequest,
  deleteEntityRequest,
} from '../../thunks/fetchEntities';
import { setSelectedWaitSpot } from '../../actions/schedule';
import withEntitiesRequest from '../../hocs/withEntities';
import DigitalWaitListItem from './DigitalWaitListItem';
import AddWaitSpotForm from './AddWaitSpotForm';
import styles from './styles.scss';
import { patientShape, waitSpotShape } from '../library/PropTypeShapes';
import WaitSpot from '../../entities/models/WaitSpot';

class DigitalWaitList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAddingWaitSpot: false,
    };

    this.getSuggestions = this.getSuggestions.bind(this);
    this.addWaitSpot = this.addWaitSpot.bind(this);
    this.toggleWaitSpotForm = this.toggleWaitSpotForm.bind(this);
    this.reinitializeState = this.reinitializeState.bind(this);
    this.removeWaitSpot = this.removeWaitSpot.bind(this);
  }

  getSuggestions(value) {
    return this.props
      .fetchEntities({
        url: '/api/patients/search',
        params: { patients: value },
      })
      .then(searchData => searchData.patients)
      .then((searchedPatients) => {
        const patientList = Object.keys(searchedPatients).length
          ? Object.keys(searchedPatients).map(key => searchedPatients[key])
          : [];
        patientList.forEach((patient) => {
          patient.display = (
            <div className={styles.suggestionContainer}>
              <Avatar user={patient} size="sm" />
              <span className={styles.suggestionContainer_fullName}>
                {`${patient.firstName} ${patient.lastName}, ${getTodaysDate(
                  this.props.timezone,
                ).diff(patient.birthDate, 'years')}`}
              </span>
            </div>
          );
        });
        return patientList;
      });
  }

  addWaitSpot(values) {
    const {
      selectedWaitSpot,
      updateEntityRequest: localUpdateEntityRequest,
      createEntityRequest: localCreateEntityRequest,
      reset: localReset,
    } = this.props;

    let newValues = {};

    if (!selectedWaitSpot) {
      newValues = Object.assign(
        {
          patientId: values.patientData.id,
          endDate: getTodaysDate(this.props.timezone)
            .add(1, 'days')
            .toISOString(),
        },
        omit(values, ['patientData']),
      );
    }
    if (selectedWaitSpot && selectedWaitSpot.patientId) {
      newValues = Object.assign(
        {
          patientId: selectedWaitSpot.patientId,
        },
        values,
      );
    } else if (selectedWaitSpot && selectedWaitSpot.patientUserId) {
      newValues = Object.assign(
        {
          patientUserId: selectedWaitSpot.patientUserId,
        },
        values,
      );
    }

    const alertCreate = {
      success: {
        body: 'Added wait spot.',
      },
      error: {
        title: 'Wait Spot Error',
        body: 'Wait spot could not be added.',
      },
    };

    const alertUpdate = {
      success: {
        body: 'Updated wait spot.',
      },
      error: {
        body: 'Wait spot could not updated.',
      },
    };

    if (!selectedWaitSpot) {
      localCreateEntityRequest({
        key: 'waitSpots',
        entityData: newValues,
        alert: alertCreate,
      });
      localReset('addWaitSpot');
    } else {
      const { waitSpotModel } = selectedWaitSpot;
      const valuesMap = Map(newValues);
      const modifiedWaitSpot = waitSpotModel.merge(valuesMap);

      localUpdateEntityRequest({
        key: 'waitSpots',
        model: modifiedWaitSpot,
        alert: alertUpdate,
      });
      localReset('editWaitSpot');
    }
    this.reinitializeState();
  }

  toggleWaitSpotForm() {
    this.setState(prevState => ({ isAddingWaitSpot: !prevState.isAddingWaitSpot }));
  }

  reinitializeState() {
    this.props.setSelectedWaitSpot(null);
    this.setState({
      isAddingWaitSpot: false,
    });
  }

  removeWaitSpot(id) {
    const confirmDelete = window.confirm('Are you sure you want to remove this wait spot?');

    if (confirmDelete) {
      this.props.deleteEntityRequest({ key: 'waitSpots',
        id });
    }

    this.reinitializeState();
  }

  render() {
    const {
      waitSpots,
      patients,
      patientUsers,
      setSelectedWaitSpot: localSetSelectedWaitSpot,
      selectedWaitSpot,
    } = this.props;

    let formName = 'addWaitSpot';
    let title = 'Add Patient to Waitlist';
    if (selectedWaitSpot) {
      formName = 'editWaitSpot';
      title = 'Edit Patient Waitlist';
    }

    return (
      <Card className={styles.reminders}>
        <DialogBox
          title={title}
          active={this.state.isAddingWaitSpot || !!selectedWaitSpot}
          onEscKeyDown={this.reinitializeState}
          onOverlayClick={this.reinitializeState}
          className={styles.modalWrapper}
          actions={[
            {
              props: { flat: true },
              component: Button,
              onClick: this.reinitializeState,
              label: 'CANCEL',
            },
            {
              props: { flat: true,
                form: formName },
              component: RemoteSubmitButton,
              onClick: this.reinitializeState,
              label: 'SAVE',
            },
          ]}
        >
          <AddWaitSpotForm
            key={formName}
            formName={formName}
            onSubmit={this.addWaitSpot}
            getSuggestions={this.getSuggestions}
            selectedWaitSpot={selectedWaitSpot}
            patients={patients}
            patientUsers={patientUsers}
          />
        </DialogBox>
        <div className={styles.reminders__header}>
          <CardHeader
            count={waitSpots.get('models').size}
            title="Digital Waitlist"
            data-test-id="waitListCount"
          >
            <Button flat compact onClick={this.toggleWaitSpotForm}>
              <div style={{ display: 'flex',
                alignItems: 'center' }}>
                Add to Waitlist <Icon style={{ marginLeft: '5px' }} size={1.5} icon="plus-circle" />
              </div>
            </Button>
          </CardHeader>
        </div>
        <div className={styles.reminders__body}>
          <List className={styles.patients}>
            {waitSpots
              .get('models')
              .toArray()
              .map((waitSpot, index) => {
                let patientData = null;

                if (waitSpot.patientUserId && !waitSpot.patientId) {
                  patientData = patientUsers.getIn(['models', waitSpot.get('patientUserId')]);
                } else if (waitSpot.patientId) {
                  patientData = patients.getIn(['models', waitSpot.get('patientId')]);
                }

                return (
                  <DigitalWaitListItem
                    key={waitSpot.id}
                    index={index}
                    waitSpot={waitSpot}
                    patientUser={patientData}
                    setSelectedWaitSpot={localSetSelectedWaitSpot}
                    handlePatientClick={this.handlePatientClick}
                    removeWaitSpot={this.removeWaitSpot}
                  />
                );
              })}
          </List>
        </div>
      </Card>
    );
  }
}

DigitalWaitList.propTypes = {
  waitSpots: PropTypes.shape(waitSpotShape).isRequired,
  patients: PropTypes.shape(patientShape).isRequired,
  fetchEntities: PropTypes.func.isRequired,
  createEntityRequest: PropTypes.func.isRequired,
  deleteEntityRequest: PropTypes.func.isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  setSelectedWaitSpot: PropTypes.func.isRequired,
  patientUsers: PropTypes.instanceOf(Map).isRequired,
  selectedWaitSpot: PropTypes.shape({
    patientUserId: PropTypes.string,
    patientId: PropTypes.string,
    waitSpotModel: PropTypes.shape(WaitSpot),
  }),
  timezone: PropTypes.string.isRequired,
};

DigitalWaitList.defaultProps = {
  selectedWaitSpot: null,
};

function mapStateToProps({ entities, schedule, auth }) {
  return {
    selectedWaitSpot: schedule.toJS().selectedWaitSpot,
    patientUsers: entities.get('patientUsers'),
    patients: entities.get('patients'),
    timezone: auth.get('timezone'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchEntities,
      createEntityRequest,
      updateEntityRequest,
      deleteEntityRequest,
      setSelectedWaitSpot,
      reset,
    },
    dispatch,
  );
}

const enhance = compose(
  withEntitiesRequest({
    id: 'waitSpots',
    key: 'waitSpots',
    join: ['patientUser', 'patient'],
    params: {
      startTime: getTodaysDate().toISOString(),
      endTime: getTodaysDate()
        .add(360, 'days')
        .toISOString(),
    },
  }),

  connect(mapStateToProps, mapDispatchToProps),
);

export default enhance(DigitalWaitList);
