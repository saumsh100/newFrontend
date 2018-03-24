
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FormatPhoneNumber } from '../../../library/util/Formatters';
import styles from './styles.scss';

function DisplayInsightDiv(header, subHeader) {
  return (
    <div className={styles.insight}>
      <div className={styles.insightBody}>
        <div className={styles.displayFlex}>
          <div className={styles.iconContainer}>
            &#x25CB;
          </div>
          <div className={styles.insightHeader}>
            {header}
          </div>
        </div>
        {subHeader ? (
          <div className={styles.insightSubHeader}>
            {subHeader}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function buildFamilyData(insightObj, patient, gender) {
  const numOfFam = insightObj.value.length;
  let textPlural = 'family members';

  if (numOfFam === 1) {
    textPlural = 'family member';
  }

  let genderOption2 = 'they';

  if (gender === 'his') {
    genderOption2 = 'he';
  } else if (gender === 'her') {
    genderOption2 = 'she';
  }

  const header = (
    <div>
      Ask <span className={styles.patientName}>{patient.firstName}&nbsp;</span>
      if {genderOption2} would like to schedule {gender} family as well.
    </div>
  );
  const subHeader = (
    <div>
      <span className={styles.patientName}>{patient.firstName}&nbsp;</span>
      has {numOfFam} {textPlural} due for Recare:

      {insightObj.value.map((famMember) => {
        if (moment(famMember.dateDue).isValid()) {
          return (
            <li className={styles.insightSubHeaderList}>
              {famMember.firstName} {famMember.lastName} was due for {moment(famMember.dateDue).format('MMM Do YYYY')}
            </li>
          );
        }
      })}
    </div>
  );
  return DisplayInsightDiv(header, subHeader);
}


function buildConfirmData(insightObj, patient, gender) {
  const header = (
    <div>
      Call <span className={styles.patientName}>{patient.firstName}</span> at {FormatPhoneNumber(patient.mobilePhoneNumber)} to confirm {gender} appointment.
    </div>
  );

  const emailCount = insightObj.value.email;
  const phoneCount = insightObj.value.phone;
  const smsCount = insightObj.value.sms;
  const total = emailCount + smsCount + phoneCount;
  const subHeader = total > 0 ? (
    <div>
      <span className={styles.patientName}>{patient.firstName}&nbsp;</span>
      has not yet confirmed {gender} appointment despite CareCru's {total} attempts. ({emailCount} Emails and {phoneCount} Phone and {smsCount} SMS)
    </div>
  ) : null;

  return DisplayInsightDiv(header, subHeader);
}

export default function InsightList(props) {
  const {
    patient,
    insightData,
  } = props;

  let displayEmailInsight = null;
  let displayPhoneInsight = null;
  let displayPatientConfirmed = null;
  let displayFamilyRecare = null;

  insightData.insights.forEach((insightObj) => {
    let gender = 'their';

    if (patient.gender) {
      if (patient.gender.toLowerCase() === 'male') {
        gender = 'his';
      } else {
        gender = 'her';
      }
    }

    if (insightObj.type === 'missingEmail') {
      const header = (
        <div>
          Ask <span className={styles.patientName}>{patient.firstName}</span> for {gender} email to receive email reminders.
        </div>
      );
      displayEmailInsight = DisplayInsightDiv(header);
    }

    if (insightObj.type === 'missingMobilePhone') {
      const header = (
        <div>
          Ask <span className={styles.patientName}>{patient.firstName}</span> for {gender} cell phone number to receive sms reminders.
        </div>
      );
      displayPhoneInsight = DisplayInsightDiv(header);
    }

    if (insightObj.type === 'confirmAttempts' && patient.mobilePhoneNumber) {
      displayPatientConfirmed = buildConfirmData(insightObj, patient, gender);
    }

    if (insightObj.type === 'familiesDueRecare') {
      displayFamilyRecare = buildFamilyData(insightObj, patient, gender);
    }
  });

  return (
    <div className={styles.insightContainer}>
      {displayEmailInsight}
      {displayPhoneInsight}
      {displayPatientConfirmed}
      {displayFamilyRecare}
    </div>
  );
}

InsightList.propTypes = {
  patient: PropTypes.object,
  insightData: PropTypes.object,
};
