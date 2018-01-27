
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Popover from 'react-popover';
import {
  List,
  ListItem,
  Card,
} from '../../../library';
import PatientData from './PatientData';
import AppointmentData from './AppointmentData';
import AppointmentPopover from './AppointmentPopover';
import styles from '../styles.scss';
import { SortByStartDate } from '../../../library/util/SortEntities';

class AppointmentsList extends Component {
  constructor(props){
    super(props);
    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount() {
    document.getElementById('appListDiv').addEventListener('scroll', this.onScroll);
  }

  onScroll() {
    this.props.handleAppointmentClick(null);
  }

  render() {
    const {
      patients,
      appointments,
      chairs,
      practitioners,
    } = this.props;


    const sortedApps = appointments.sort(SortByStartDate);

    return (
      <Card noBorder className={styles.appCard} >
        <List className={styles.appList} id="appListDiv">
          {sortedApps.map((app) => {
            const patient = patients.get(app.patientId);
            const chair = chairs.get(app.chairId);
            const practitioner = practitioners.get(app.practitionerId);

            return (
              <Popover
                className={styles.appPopover}
                isOpen={app.id === this.props.selectedApp}
                body={[(
                  <AppointmentPopover
                    appointment={app}
                    patient={patient}
                    chair={chair}
                    practitioner={practitioner}
                    closePopover={()=> this.props.handleAppointmentClick(null)}
                    handleEditAppointment={this.props.handleEditAppointment}
                  />
                )]}
                preferPlace="right"
                tipSize={12}
                onOuterAction={() => this.props.handleAppointmentClick(null)}
              >
                <ListItem
                  className={styles.appItem}
                  onDoubleClick={() => this.props.handleEditAppointment(app.id)}
                  onClick={() => {
                    this.props.handleAppointmentClick(app.id);
                  }}
                >
                  <AppointmentData
                    appointment={app}
                  />
                  <PatientData
                    appointment={app}
                    patient={patient}
                  />
                </ListItem>
              </Popover>
            );
          })}
        </List>
      </Card>
    );
  }
}

AppointmentsList.propTypes = {
  patients: PropTypes.object,
  appointments: PropTypes.object,
  handleAppointmentClick: PropTypes.func,
  selectedApp: PropTypes.string,
};

export default AppointmentsList;
