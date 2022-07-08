import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { formatPhoneNumber } from '../../../util/isomorphic';
import { selectAppointmentShape } from '../../library/PropTypeShapes';
import { getUTCDate, getFormattedDate } from '../../library';
import styles from './reskin-styles.scss';
import Item from './Item';

const MoreSummary = (props) => {
  const { patientUsers, selectedAppointment, requests, timezone } = props;
  const { requestModel } = selectedAppointment;
  const request = requests.get(requestModel.get('id'));
  const patientUser = patientUsers.get(request.get('patientUserId'));
  const birthDate = patientUser.get('birthDate');
  const requestingUser = patientUsers.get(request.get('requestingPatientUserId'));
  const carrier = patientUser.get('insuranceCarrier');
  const memberId = patientUser.get('insuranceMemberId');
  const groupId = patientUser.get('insuranceGroupId');
  const requesterCarrier = requestingUser.get('insuranceCarrier');
  const requesterMemberId = requestingUser.get('insuranceMemberId');
  const requesterGroupId = requestingUser.get('insuranceGroupId');
  const requestedAt = getFormattedDate(request.get('createdAt'), 'MMM D, hh:mm A', timezone);

  return (
    <div className={styles.summery}>
      <div className={styles.summaryTitle}>Patient Summary</div>
      <div className={styles.summaryData}>
        <div className={styles.itemContainer}>
          <Item
            title="Birthday"
            index="BIRTHDAY"
            value={getFormattedDate(birthDate, 'LL', timezone)}
          />
          <Item
            title="Phone"
            index="PHONE"
            value={formatPhoneNumber(patientUser.get('phoneNumber'))}
          />
          <Item
            title="Insurance"
            index="INSURANCE"
            value={carrier}
            extra={[
              {
                extraTitle: 'Member ID:',
                extraValue: memberId,
              },
              {
                extraTitle: 'Group ID:',
                extraValue: groupId,
              },
            ]}
          />
          <Item title="Email" index="EMAIL" value={patientUser.get('email')} />
          <Item title="Notes" index="NOTES" value={request.get('note')} />
        </div>
      </div>
      <div className={styles.border} />

      <div className={styles.summaryTitle}>Requester Info</div>
      <div className={styles.summaryData}>
        <div className={styles.itemContainer}>
          <Item
            title="Requested By"
            index="REQUESTED BY"
            value={requestingUser.get('firstName').concat(' ', requestingUser.get('lastName'))}
          />
          <Item
            title="Requester Birth Date"
            index="REQUESTER BIRTH DATE"
            value={getUTCDate(requestingUser.get('birthDate'), timezone).format('LL')}
          />
          <Item
            title="Phone"
            index="PHONE"
            value={formatPhoneNumber(requestingUser.get('phoneNumber'))}
          />
          <Item title="Email" index="EMAIL" value={requestingUser.get('email')} />
          <Item
            title="Insurance"
            index="INSURANCE"
            value={requesterCarrier}
            extra={[
              {
                extraTitle: 'Member ID:',
                extraValue: requesterMemberId,
              },
              {
                extraTitle: 'Group ID:',
                extraValue: requesterGroupId,
              },
            ]}
          />
          <Item title="Requested On" index="REQUESTED ON" value={requestedAt} />
        </div>
      </div>
    </div>
);
};

MoreSummary.propTypes = {
  requests: PropTypes.instanceOf(Map).isRequired,
  patientUsers: PropTypes.instanceOf(Map).isRequired,
  selectedAppointment: PropTypes.shape(selectAppointmentShape),
  timezone: PropTypes.string.isRequired,
};

MoreSummary.defaultProps = {
  selectedAppointment: null,
};

export default MoreSummary;
