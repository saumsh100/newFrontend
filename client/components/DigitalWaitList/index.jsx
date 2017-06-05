
import React, { Component, PropTypes } from 'react';
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
  IconButton,
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
    this.handlePatientClick = this.handlePatientClick.bind(this);
    this.reinitializeState = this.reinitializeState.bind(this);
    this.removeWaitSpot = this.removeWaitSpot.bind(this);
  }

  getSuggestions(value) {
    return this.props.fetchEntities({ url: '/api/patients/search', params:  { patients: value } })
      .then(searchData => searchData.patients)
      .then((searchedPatients) => {
        return Object.keys(searchedPatients).length ? Object.keys(searchedPatients).map(
            (key) => { return searchedPatients[key]; }) : [];
      });
  }

  addWaitSpot(values) {
    const {
      selectedWaitSpot,
      updateEntityRequest,
      createEntityRequest,
      reset,
    } = this.props;

    const newValues = Object.assign(
      { patientId: values.patientData.id },
      omit(values, ['patientData'])
    );

    if (!selectedWaitSpot) {
      createEntityRequest({
        key: 'waitSpots',
        entityData: newValues,
      });
      reset('addWaitSpot');
    } else {
      const waitSpotModel = selectedWaitSpot.waitSpotModel;
      const valuesMap = Map(newValues);
      const modifiedWaitSpot = waitSpotModel.merge(valuesMap);

      updateEntityRequest({ key: 'waitSpots', model: modifiedWaitSpot });
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

  handlePatientClick(id) {
    this.props.setSelectedWaitSpot(null);
    this.props.setSelectedPatientId(id);
    this.props.push('/patients/list');
  }

  removeWaitSpot(id) {
    const confirmDelete = confirm('Are you sure you want to remove this wait spot?');

    if (confirmDelete) {
      this.props.deleteEntityRequest({ key: 'waitSpots', id });
    }
  }

  render() {
    const {
      borderColor,
      cardTitle,
      waitSpots,
      patients,
      isFetching,
      setSelectedWaitSpot,
      selectedWaitSpot,
    } = this.props;

    let formName = 'addWaitSpot';
    if (selectedWaitSpot) {
      formName = 'editWaitSpot';
    }

    return (
      <Card className={styles.reminders}>
        <DialogBox
          title="Add Patient to Waitlist"
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
            {waitSpots.get('models').toArray().map((waitSpot) => {
              const patient = patients.getIn(['models', waitSpot.get('patientId')]);
              return (
                <DigitalWaitListItem
                  key={waitSpot.get('id')}
                  waitSpot={waitSpot}
                  patient={patient}
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
  isFetching: PropTypes.bool.isRequired,
  reset: PropTypes.func.isRequired,
  setSelectedPatientId: PropTypes.func.isRequired,
  setSelectedWaitSpot: PropTypes.func.isRequired,
  selectedWaitSpot: PropTypes.object.isRequired,
  push: PropTypes.func.isRequired,
};

function mapStateToProps({ entities, schedule }) {
  return {
    selectedWaitSpot: schedule.toJS().selectedWaitSpot,
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
    join: ['patient'],
  }),

  connect(mapStateToProps, mapDispatchToProps),
);

export default enhance(DigitalWaitList);
