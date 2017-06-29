
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import moment from 'moment-timezone';
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
  IconButton,
  Avatar,
  RemoteSubmitButton,
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
import { SortByFirstName } from '../library/util/SortEntities';
import styles from './styles.scss';

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
    return this.props.fetchEntities({ url: '/api/patients/search', params:  { patients: value } })
      .then((searchData) => {
        return searchData.patients;})
      .then((searchedPatients) => {
        const patientList = Object.keys(searchedPatients).length ? Object.keys(searchedPatients).map(
          (key) => searchedPatients[key]) : [];
        patientList.map((patient) => {
          patient.display = (
            <div className={styles.suggestionContainer}>
              <Avatar user={patient} size="lg" />
              <span className={styles.suggestionContainer_fullName}>
                {`${patient.firstName} ${patient.lastName}, ${moment().diff(patient.birthDate, 'years')}`}
              </span>
            </div>
          );
        })
        return patientList;
      });
  }

  addWaitSpot(values) {
    const {
      selectedWaitSpot,
      updateEntityRequest,
      createEntityRequest,
      reset,
    } = this.props;

    let newValues = {}

    if (!selectedWaitSpot) {
      newValues = Object.assign(
        { patientId: values.patientData.id },
        omit(values, ['patientData'])
      );
    }
    if (selectedWaitSpot && selectedWaitSpot.patientId) {
      newValues = Object.assign({
        patientId: selectedWaitSpot.patientId,
      }, values);
    } else if (selectedWaitSpot && selectedWaitSpot.patientUserId) {
      newValues = Object.assign({
        patientUserId: selectedWaitSpot.patientUserId,
      }, values);
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
      createEntityRequest({
        key: 'waitSpots',
        entityData: newValues,
        alert: alertCreate,
      });
      reset('addWaitSpot');
    } else {
      const waitSpotModel = selectedWaitSpot.waitSpotModel;
      const valuesMap = Map(newValues);
      const modifiedWaitSpot = waitSpotModel.merge(valuesMap);

      updateEntityRequest({
        key: 'waitSpots',
        model: modifiedWaitSpot,
        alert: alertUpdate,
      });
      reset('editWaitSpot');
    }
    this.reinitializeState();
  }

  toggleWaitSpotForm() {
    this.setState({ isAddingWaitSpot: !this.state.isAddingWaitSpot });
  }

  reinitializeState() {
    this.props.setSelectedWaitSpot(null);
    this.setState({
      isAddingWaitSpot: false,
    });
  }

  removeWaitSpot(id) {
    const confirmDelete = confirm('Are you sure you want to remove this wait spot?');

    if (confirmDelete) {
      this.props.deleteEntityRequest({ key: 'waitSpots', id });
    }

    this.reinitializeState();
  }

  render() {
    const {
      borderColor,
      cardTitle,
      waitSpots,
      patients,
      patientUsers,
      isFetching,
      setSelectedWaitSpot,
      selectedWaitSpot,
    } = this.props;


    let formName = 'addWaitSpot';
    let title = "Add Patient to Waitlist"
    if (selectedWaitSpot) {
      formName = 'editWaitSpot';
      title = "Edit Patient Waitlist"
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
              props: { flat: true, form: formName },
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
          >
            <Button
              flat
              onClick={this.toggleWaitSpotForm}
            >
              Add to Waitlist <Icon style={{ marginLeft: '5px' }} icon="plus-circle" />
            </Button>
          </CardHeader>
        </div>
        <div className={styles.reminders__body}>
          <List className={styles.patients}>
            {waitSpots.get('models').toArray().map((waitSpot, index) => {
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
                  setSelectedWaitSpot={setSelectedWaitSpot}
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
  waitSpots: PropTypes.object.isRequired,
  patients: PropTypes.object.isRequired,
  fetchEntities: PropTypes.func.isRequired,
  createEntityRequest: PropTypes.func.isRequired,
  deleteEntityRequest: PropTypes.func.isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  reset: PropTypes.func.isRequired,
  setSelectedPatientId: PropTypes.func.isRequired,
  setSelectedWaitSpot: PropTypes.func.isRequired,
  selectedWaitSpot: PropTypes.object,
  push: PropTypes.func.isRequired,
};

function mapStateToProps({ entities, schedule }) {
  return {
    selectedWaitSpot: schedule.toJS().selectedWaitSpot,
    patientUsers: entities.get('patientUsers'),
    patients: entities.get('patients'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    createEntityRequest,
    updateEntityRequest,
    deleteEntityRequest,
    setSelectedWaitSpot,
    reset,
  }, dispatch);
}

const enhance = compose(
  withEntitiesRequest({
    id: 'waitSpots',
    key: 'waitSpots',
    join: ['patientUser', 'patient'],
  }),

  connect(mapStateToProps, mapDispatchToProps),
);

export default enhance(DigitalWaitList);
