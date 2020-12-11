
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Popover from 'react-popover';
import { connect } from 'react-redux';
import AppointmentInfo from '../../../library/AppointmentPopover/AppointmentInfo';
import { Button } from '../../../library';
import styles from './styles.scss';
import { practitionerShape, appointmentShape } from '../../../library/PropTypeShapes';

const ShowMark = (props) => {
  const {
    appointment,
    appStyle,
    containerStyle,
    isNoteFormActive,
    isFollowUpsFormActive,
    isRecallsFormActive,
    placement,
    practitioner,
    timezone,
  } = props;
  const { note, description } = appointment;
  const [isOpened, setIsOpened] = useState(false);
  const isAnyFormActive = isNoteFormActive || isFollowUpsFormActive || isRecallsFormActive;
  const closePopover = () => setIsOpened(false);
  const togglePopover = () => setIsOpened(!isOpened);
  const notes = description || note || '';
  return (
    <Popover
      isOpen={isOpened}
      body={[
        <AppointmentInfo
          appointment={appointment}
          title="Reserve
          Time"
          closePopover={closePopover}
          timezone={timezone}
          extraStyles={{
            note: {
              maxHeight: '120px',
              height: '120px',
            },
          }}
        />,
      ]}
      preferPlace={placement}
      tipSize={12}
      onOuterAction={!isAnyFormActive && closePopover}
      className={styles.appPopover}
    >
      <Button
        onClick={togglePopover}
        className={styles.appointmentContainer}
        style={containerStyle}
        data-test-id={`appointment_${practitioner?.get('firstName')}${practitioner?.get(
          'lastName',
        )}`}
      >
        <div
          className={classnames(styles.showAppointment, styles.showMark)}
          style={{
            ...appStyle,
            overflow: 'auto',
          }}
        >
          <div className={styles.mark}>
            <span className={styles.mark_note} style={appStyle}>
              {notes}
            </span>
          </div>
        </div>
      </Button>
    </Popover>
  );
};

ShowMark.propTypes = {
  appointment: PropTypes.shape(appointmentShape).isRequired,
  timeSlotHeight: PropTypes.shape({
    height: PropTypes.number,
  }),
  containerStyle: PropTypes.shape({
    top: PropTypes.string,
    width: PropTypes.string,
    left: PropTypes.string,
  }),
  appStyle: PropTypes.shape({
    height: PropTypes.string,
    backgroundColor: PropTypes.string,
    zIndex: PropTypes.number,
  }),
  isNoteFormActive: PropTypes.bool.isRequired,
  isFollowUpsFormActive: PropTypes.bool.isRequired,
  isRecallsFormActive: PropTypes.bool.isRequired,
  placement: PropTypes.string,
  practitioner: PropTypes.shape(practitionerShape).isRequired,
  timezone: PropTypes.string.isRequired,
};

ShowMark.defaultProps = {
  containerStyle: {},
  appStyle: {},
  timeSlotHeight: {},
  placement: '',
};

const mapStateToProps = ({ entities, patientTable }, { appointment }) => ({
  isNoteFormActive: patientTable.get('isNoteFormActive'),
  isFollowUpsFormActive: patientTable.get('isFollowUpsFormActive'),
  isRecallsFormActive: patientTable.get('isRecallsFormActive'),
  practitioner: entities
    .getIn(['practitioners', 'models'])
    .toArray()
    .find(practitioner => practitioner.id === appointment.practitionerId),
});

export default connect(mapStateToProps, null)(ShowMark);
