
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { formatPhoneNumber } from '@carecru/isomorphic';
import { patientShape, appointmentShape } from '../../../library/PropTypeShapes';
import { PatientPopover, Avatar, AppointmentPopover } from '../../../library';
import styles from './styles.scss';

/**
 * displayInsightDiv renders the insight with a header and an optional sub header.
 * @param header
 * @param subHeader
 * @returns {XML}
 */
function displayInsightDiv(header, subHeader) {
  return (
    <div className={styles.insight}>
      <div className={styles.insightBody}>
        <div className={styles.displayFlex}>
          <div className={styles.iconContainer}>&#x25CF;</div>
          <div className={styles.insightHeader}>{header}</div>
        </div>
        {subHeader && <div className={styles.insightSubHeader}>{subHeader}</div>}
      </div>
    </div>
  );
}

/**
 * displaySubHeaderDiv renders a custom sub header.
 * @param content
 * @param index
 * @returns {XML}
 */
function displaySubHeaderDiv(content, index) {
  return (
    <div className={styles.displayFlexSubHeader} key={`subHeaderDiv_${index}`}>
      <div className={styles.insightSubHeaderList}>{content}</div>
    </div>
  );
}

/**
 * buildFamilyData creates the sentence structure for family insights
 * @param insightObj
 * @param patient
 * @param gender
 */
function buildFamilyData(insightObj, patient, gender, timezone) {
  const numOfFam = insightObj.value.length;
  const totalFamilyMember = numOfFam === 1 ? 'family member' : 'family members';
  const genderOption2 = (gender === 'his' && 'he') || (gender === 'her' && 'she') || 'they';

  const header = (
    <div>
      <span className={styles.patientName}>{patient.firstName}</span> has {numOfFam}{' '}
      {totalFamilyMember} due for Recare. Ask if {genderOption2} would like to schedule{' '}
      {numOfFam > 1 ? 'a' : 'this'} family member.
    </div>
  );
  const subHeader = (
    <div>
      {insightObj.value.map((famMember, index) => {
        if (moment(famMember.dateDue).isValid()) {
          const subHeaderDiv = (
            <div>
              {famMember.firstName} {famMember.lastName} was due for{' '}
              {moment.tz(famMember.dateDue, timezone).format('MMM Do YYYY')}
            </div>
          );
          return displaySubHeaderDiv(subHeaderDiv, index);
        }
        return null;
      })}
    </div>
  );
  return displayInsightDiv(header, subHeader);
}

/**
 * buildConfirmData builds the sentence structure for unconfirmed patients.
 * @param insightObj
 * @param patient
 * @param gender
 * @returns {XML}
 */
function buildConfirmData(insightObj, patient, gender) {
  const { confirmAttempts, cellPhoneNumber } = insightObj.value;
  const header = (
    <div>
      Call <span className={styles.patientName}>{patient.firstName}</span> at{' '}
      {formatPhoneNumber(cellPhoneNumber)} to confirm {gender} appointment.
    </div>
  );

  const emailCount = confirmAttempts.email;
  const phoneCount = confirmAttempts.phone;
  const smsCount = confirmAttempts.sms;
  const total = emailCount + smsCount + phoneCount;

  const subHeaderDiv = total > 0 && (
    <div>
      <span className={styles.patientName}>{patient.firstName} </span>
      has not yet confirmed {gender} appointment despite CareCru&apos;s {total} attempt
      {total > 1 && 's'}. (
      {buildAttemptData({
        email: emailCount,
        sms: smsCount,
        phone: phoneCount,
      })}
      )
    </div>
  );
  const subHeader = total > 0 && displaySubHeaderDiv(subHeaderDiv, 0);

  return displayInsightDiv(header, subHeader);
}

/**
 * buildAttemptData appends to to the confirm sentence any attempts sent out to the patient.
 * @param countObj
 * @returns {string}
 */
function buildAttemptData(countObj) {
  const keys = Object.keys(countObj);

  let sentence = '';
  keys
    .filter(k => countObj[k] > 0)
    .forEach((k, index, arr) => {
      const addTo = index < arr.length - 1 ? `${countObj[k]} ${k} and ` : `${countObj[k]} ${k}`;
      if (addTo) {
        sentence += addTo;
      }
    });

  return sentence;
}

/**
 * buildMissingEmailData constructs the sentence for a patient who is missing an email
 * @param patient
 * @param gender
 * @returns {XML}
 */
function buildMissingEmailData(patient, gender) {
  const header = (
    <div>
      Ask <span className={styles.patientName}>{patient.firstName}</span> for {gender} email to
      receive email reminders.
    </div>
  );
  return displayInsightDiv(header);
}

/**
 * buildMissingPhoneDaga constructs the insight sentence for a patient missing a mobilePhoneNumber
 * @param patient
 * @param gender
 * @returns {XML}
 */
function buildMissingPhoneData(patient, gender) {
  const header = (
    <div>
      Ask <span className={styles.patientName}>{patient.firstName}</span> for {gender} cell phone
      number to receive sms reminders.
    </div>
  );
  return displayInsightDiv(header);
}

export default function InsightList(props) {
  const { patient, insightData, scrollId, appointment, timezone } = props;

  let displayEmailInsight = null;
  let displayPhoneInsight = null;
  let displayPatientConfirmed = null;
  let displayFamilyRecare = null;

  insightData.insights.forEach((insightObj) => {
    const gender =
      (patient && patient.gender && (patient.gender.toLowerCase() === 'male' ? 'his' : 'her')) ||
      'their';

    if (insightObj && insightObj.type === 'missingEmail') {
      displayEmailInsight = buildMissingEmailData(patient, gender);
    }

    if (insightObj && insightObj.type === 'missingMobilePhone') {
      displayPhoneInsight = buildMissingPhoneData(patient, gender);
    }

    if (insightObj && insightObj.type === 'confirmAttempts') {
      displayPatientConfirmed = buildConfirmData(insightObj, patient, gender);
    }

    if (insightObj && insightObj.type === 'familiesDueRecare') {
      displayFamilyRecare = buildFamilyData(insightObj, patient, gender, timezone);
    }
  });

  return (
    <div className={styles.outerInsightsWrapper}>
      <div className={styles.innerInsightsWrapper}>
        <div className={styles.insightsList}>
          <div className={styles.appBody}>
            <AppointmentPopover scrollId={scrollId} appointment={appointment} patient={patient}>
              <div className={styles.apptData}>
                <div className={styles.apptData_time}>
                  {moment(appointment.startDate).format('h:mm a')}
                </div>
                <div className={styles.apptData_date}>
                  {moment(appointment.startDate).format('MMM DD')}
                </div>
              </div>
            </AppointmentPopover>
          </div>

          <div className={styles.patientInfo_name}>
            <PatientPopover scrollId={scrollId} patient={patient}>
              <div className={styles.patientNameAvatar}>
                <Avatar
                  user={patient}
                  size="sm"
                  noPadding
                  className={styles.patientNameAvatar_avatar}
                />

                <div className={styles.patientNameAvatar_text}>
                  <div className={styles.patientInfo_firstLast}>{patient.firstName}</div>
                  <div className={styles.patientInfo_firstLast}>{patient.lastName}</div>
                </div>
              </div>
            </PatientPopover>
          </div>

          <div className={styles.insightContainer}>
            {displayPatientConfirmed}
            {displayFamilyRecare}
            {displayEmailInsight}
            {displayPhoneInsight}
          </div>
        </div>
      </div>
    </div>
  );
}

InsightList.propTypes = {
  patient: PropTypes.shape(patientShape).isRequired,
  insightData: PropTypes.shape({
    appointmentId: PropTypes.string,
    patientId: PropTypes.string,
    insights: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string,
        value: PropTypes.any,
      }),
    ),
  }).isRequired,
  scrollId: PropTypes.string,
  appointment: PropTypes.shape(appointmentShape).isRequired,
  timezone: PropTypes.string.isRequired,
};

InsightList.defaultProps = { scrollId: '' };
