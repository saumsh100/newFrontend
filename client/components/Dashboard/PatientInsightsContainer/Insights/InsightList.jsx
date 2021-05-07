import React from 'react';
import PropTypes from 'prop-types';
import { formatPhoneNumber } from '../../../../util/isomorphic';
import { patientShape, appointmentShape } from '../../../library/PropTypeShapes';
import {
  AppointmentPopover,
  Avatar,
  calculateAge,
  getFormattedDate,
  isDateValid,
  PatientPopover,
} from '../../../library';
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
function buildFamilyData(insightObj, patient, timezone) {
  const numOfFam = insightObj.value.length;
  const totalFamilyMember = numOfFam === 1 ? 'family member' : 'family members';

  const header = (
    <div>
      <span className={styles.patientName}>{patient.firstName}</span>
      {` has ${numOfFam} ${totalFamilyMember} due for Recare.`}
    </div>
  );
  const subHeader = (
    <div>
      {insightObj.value.map((famMember, index) => {
        if (isDateValid(famMember.dateDue)) {
          const famMemberAge = famMember.birthDate ? calculateAge(famMember.birthDate, timezone) : null;
          const subHeaderDiv = (
            <div>
              {famMember.firstName} {famMember.lastName} {famMemberAge && `, ${famMemberAge} years old, `} was due for{' '}
              {getFormattedDate(famMember.dateDue, 'MMM Do YYYY', timezone)}
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
    .filter((k) => countObj[k] > 0)
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
      displayFamilyRecare = buildFamilyData(insightObj, patient, timezone);
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
                  {getFormattedDate(appointment.startDate, 'h:mm a', timezone)}
                </div>
                <div className={styles.apptData_date}>
                  {getFormattedDate(appointment.startDate, 'MMM DD', timezone)}
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
        value: PropTypes.arrayOf(PropTypes.any),
      }),
    ),
  }).isRequired,
  scrollId: PropTypes.string,
  appointment: PropTypes.shape(appointmentShape).isRequired,
  timezone: PropTypes.string.isRequired,
};

InsightList.defaultProps = { scrollId: '' };
