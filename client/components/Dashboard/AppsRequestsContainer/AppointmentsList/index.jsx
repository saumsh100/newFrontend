import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { AppointmentPopover, Card, List, ListItem } from '../../../library';
import PatientData from './PatientData';
import AppointmentData from './AppointmentData';
import { SortByStartDate } from '../../../library/util/SortEntities';
import styles from '../../styles';

const AppointmentsList = (props) => {
  const { patients, appointments, chairs, practitioners } = props;

  if (!appointments.size) {
    return <div className={styles.noApps}>No Appointments</div>;
  }

  const sortedApps = appointments.sort(SortByStartDate);

  return (
    <Card noBorder className={styles.appRequestContainer_appCard}>
      <List className={styles.appRequestContainer_appList} id="appListDiv">
        {sortedApps.valueSeq().map((app) => {
          const patient = patients.get(app.patientId);
          const chair = chairs.get(app.chairId);
          const practitioner = practitioners.get(app.practitionerId);

          return (
            <AppointmentPopover
              appointment={app}
              patient={patient}
              practitioner={practitioner}
              chair={chair}
              key={app.id}
              scrollId="appListDiv"
            >
              <ListItem
                className={styles.appRequestContainer_appItem}
                onDoubleClick={() => props.handleEditAppointment(app.id)}
                onClick={() => {
                  props.handleAppointmentClick(app.id);
                }}
              >
                <AppointmentData appointment={app} />
                <PatientData appointment={app} patient={patient} practitioner={practitioner} />
              </ListItem>
            </AppointmentPopover>
          );
        })}
      </List>
    </Card>
  );
};

AppointmentsList.propTypes = {
  appointments: PropTypes.instanceOf(Map),
  chairs: PropTypes.instanceOf(Map),
  patients: PropTypes.instanceOf(Map),
  practitioners: PropTypes.instanceOf(Map),
  handleAppointmentClick: PropTypes.func.isRequired,
  handleEditAppointment: PropTypes.func.isRequired,
};

AppointmentsList.defaultProps = {
  appointments: null,
  chairs: null,
  patients: null,
  practitioners: null,
};

export default AppointmentsList;
