
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Popover from 'react-popover';
import { List, ListItem, Card, AppointmentPopover } from '../../../library';
import PatientData from './PatientData';
import AppointmentData from './AppointmentData';
import styles from '../styles.scss';
import { SortByStartDate } from '../../../library/util/SortEntities';

class AppointmentsList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      patients, appointments, chairs, practitioners,
    } = this.props;

    if (!appointments.size) {
      return <div className={styles.noApps}>No Appointments</div>;
    }

    const sortedApps = appointments.sort(SortByStartDate);

    return (
      <Card noBorder className={styles.appCard}>
        <List className={styles.appList} id="appListDiv">
          {sortedApps.map((app) => {
            const patient = patients.get(app.patientId);
            const chair = chairs.get(app.chairId);
            const practitioner = practitioners.get(app.practitionerId);

            return (
              <AppointmentPopover
                appointment={app}
                patient={patient}
                practitioner={practitioner}
                chair={chair}
                scrollId="appListDiv"
              >
                <ListItem
                  className={styles.appItem}
                  onDoubleClick={() => this.props.handleEditAppointment(app.id)}
                  onClick={() => {
                    this.props.handleAppointmentClick(app.id);
                  }}
                >
                  <AppointmentData appointment={app} />
                  <PatientData
                    appointment={app}
                    patient={patient}
                    practitioner={practitioner}
                  />
                </ListItem>
              </AppointmentPopover>
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
