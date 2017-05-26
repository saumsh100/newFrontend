
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { compose } from 'recompose';
import { connect } from 'react-redux';
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
    const newValues = Object.assign(
      { patientId: values.patientData.id },
      omit(values, ['patientData'])
    );

    this.props.createEntityRequest({
      key: 'waitSpots',
      entityData: newValues,
    });

    this.setState({ isAddingWaitSpot: false });
    this.props.reset('addWaitSpot');
  }

  toggleWaitSpotForm() {
    this.setState({ isAddingWaitSpot: !this.state.isAddingWaitSpot });
  }

  render() {
    const {
      borderColor,
      cardTitle,
      waitSpots,
      patients,
      isFetching,
    } = this.props;

    return (
      <Card className={styles.reminders}>
        <DialogBox
          title="Add Patient to Waitlist"
          active={this.state.isAddingWaitSpot}
          onEscKeyDown={this.toggleWaitSpotForm}
          onOverlayClick={this.toggleWaitSpotForm}
          className={styles.modalWrapper}
          actions={[
            {
              props: { flat: true },
              component: Button,
              onClick: this.toggleWaitSpotForm,
              label: 'CANCEL',
            },
            {
              props: { flat: true, form: 'addWaitSpot' },
              component: RemoteSubmitButton,
              onClick: this.toggleWaitSpotForm,
              label: 'SAVE',
            },
          ]}
        >
          <AddWaitSpotForm onSubmit={this.addWaitSpot} getSuggestions={this.getSuggestions} />
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
};

function mapStateToProps({ entities }) {
  return {
    patients: entities.get('patients'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    createEntityRequest,
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
