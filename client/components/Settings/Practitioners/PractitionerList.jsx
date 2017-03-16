import React, {Component, PropTypes, } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createEntityRequest } from '../../../thunks/fetchEntities';
import { setPractitionerId } from '../../../actions/accountSettings';
import { IconButton, CardHeader, } from '../../library';
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

  createPractitioner(values) {
    values.firstName = values.firstName.trim();
    values.lastName = values.lastName.trim();
    const key = 'practitioners';
    this.props.createEntityRequest({ key, entityData: values })
      .then((entities) => {
        const id = Object.keys(entities[key])[0];
        this.props.setPractitionerId({ id });
    });
    this.setState({ active: false });
  }

  setActive() {
    const active = (this.state.active !== true);
    this.setState({ active });
  }

  render() {
    const { practitioners, practitionerId, weeklySchedules } = this.props;

    const selectedPractitioner = (
      practitionerId ? practitioners.get(practitionerId) : practitioners.first());
    const weeklyScheduleId = selectedPractitioner ? selectedPractitioner.get('weeklyScheduleId') : null;
    const weeklySchedule = weeklyScheduleId ? weeklySchedules.get(weeklyScheduleId) : null;

    return (
      <div className={styles.practMainContainer} >
        <div className={styles.practListContainer}>
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
            >
              <CreatePractitionerForm
                onSubmit={this.createPractitioner}
              />
            </Modal>
          </div>
          <div>
            {practitioners.toArray().map((practitioner) => {
              return (
                <PractitionerItem
                  key={practitioner.get('id')}
                  id={practitioner.get('id')}
                  fullname={practitioner.getFullName()}
                  setPractitionerId={this.props.setPractitionerId}
                />
              );
            })}
          </div>
        </div>
        <div className={styles.practDataContainer}>
          <PractitionerTabs
            practitioner={selectedPractitioner}
            weeklySchedule={weeklySchedule}
            setPractitionerId={this.props.setPractitionerId}
          />
        </div>
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
    setPractitionerId,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapActionsToProps);
export default enhance(PractitionerList);