
import React, {Component, PropTypes, } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { createEntityRequest, updateEntityRequest } from '../../../thunks/fetchEntities';
import { setPractitionerId } from '../../../actions/accountSettings';
import { IconButton, CardHeader, Col } from '../../library';
import PractitionerTabs from './PractitionerTabs';
import PractitionerItem from './PractitionerItem';
import CreatePractitionerForm from './CreatePractitionerForm';
import Modal  from '../../library/Modal';
import styles from './styles.scss';

class PractitionerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    };

    this.setActive = this.setActive.bind(this);
    this.createPractitioner = this.createPractitioner.bind(this);
  }

  componentWillMount() {
    this.props.setPractitionerId({ id: null });
  }

  setActive() {
    const active = (this.state.active !== true);
    this.setState({ active });
  }

  createPractitioner(values) {

    const { services } = this.props;

    values.firstName = values.firstName.trim();
    values.lastName = values.lastName.trim();

    const key = 'practitioners';

    let serviceIds = [];
    if (services) {
      serviceIds = services.toArray().map((service) => service.get('id'));
    }

    //creates the practitioner and then updates with all services set to true 
    this.props.createEntityRequest({ key, entityData: values })
      .then((entities) => {
        const id = Object.keys(entities[key])[0];
        let savedPrac = entities[key][id];

        savedPrac.id = id;
        savedPrac.services = serviceIds;
        const modifiedPrac = Map(savedPrac);

        this.props.updateEntityRequest({ key: 'practitioners', model: modifiedPrac, url: `/api/practitioners/${id}` });
        this.props.setPractitionerId({ id });
      });

    this.setState({ active: false });
  }

  render() {
    const {
      practitioners,
      practitionerId,
      weeklySchedules,
      services,
      timeOffs,
    } = this.props;

    const selectedPractitioner = (practitionerId ?
      practitioners.get(practitionerId) : practitioners.first());

    const weeklyScheduleId = selectedPractitioner ? selectedPractitioner.get('weeklyScheduleId') : null;
    const weeklySchedule = weeklyScheduleId ? weeklySchedules.get(weeklyScheduleId) : null;

    let filteredTimeOffs = null;
    if (timeOffs) {
      filteredTimeOffs = timeOffs.filter((timeOff) => {
        return timeOff.practitionerId === selectedPractitioner.get('id');
      });
    }

    return (
      <div className={styles.practMainContainer} >
        <Col xs={2} className={styles.practListContainer}>
          <div className={styles.modalContainer}>
            <CardHeader count={practitioners.size} title="Practitioners" />
            <IconButton
              icon="plus"
              onClick={this.setActive}
              className={styles.addPractitionerButton}
            />
            <Modal
              active={this.state.active}
              onEscKeyDown={this.setActive}
              onOverlayClick={this.setActive}
              title="Add New Practitioner"
            >
              <CreatePractitionerForm
                onSubmit={this.createPractitioner}
              />
            </Modal>
          </div>
            {practitioners.toArray().map((practitioner) => {
              return (
                <PractitionerItem
                  key={practitioner.get('id')}
                  id={practitioner.get('id')}
                  fullName={practitioner.getFullName()}
                  setPractitionerId={this.props.setPractitionerId}
                />
              );
            })}
        </Col>
        <Col xs={10} className={styles.practDataContainer}>
          <PractitionerTabs
            key={this.props.practitionerId}
            practitioner={selectedPractitioner}
            weeklySchedule={weeklySchedule}
            setPractitionerId={this.props.setPractitionerId}
            services={services}
            timeOffs={filteredTimeOffs}
          />
        </Col>
      </div>
    );
  }
}

function mapStateToProps({ accountSettings }) {
  const practitionerId = accountSettings.get('practitionerId');
  if(!practitionerId) {
    return {};
  }
  return {
    practitionerId,
  };
}
function mapActionsToProps(dispatch) {
  return bindActionCreators({
    createEntityRequest,
    updateEntityRequest,
    setPractitionerId,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapActionsToProps);
export default enhance(PractitionerList);
