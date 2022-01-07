import { gql } from '@apollo/client';

export default gql`
  query PatientInfo_Query($patientId: String!) {
    accountViewer {
      id
      patient(id: $patientId) {
        id
        ccId
        family {
          id
          ccId
          head {
            id
            ccId
            pmsId
            accountId
            avatarUrl
            firstName
            lastName
            birthDate
            lastApptDate
            nextApptDate
            dueForHygieneDate
            dueForRecallExamDate
            status
            omitReminderIds
            omitRecallIds
            cellPhoneNumber
            mobilePhoneNumber
            homePhoneNumber
            workPhoneNumber
            isPhoneNumberAvailable
            isSMSEnabled
            isVoiceEnabled
            phoneNumberType
          }
          members {
            edges {
              node {
                id
                ccId
                pmsId
                accountId
                avatarUrl
                firstName
                lastName
                birthDate
                lastApptDate
                nextApptDate
                dueForHygieneDate
                dueForRecallExamDate
                status
                omitReminderIds
                omitRecallIds
                cellPhoneNumber
                mobilePhoneNumber
                homePhoneNumber
                workPhoneNumber
                isPhoneNumberAvailable
                isSMSEnabled
                isVoiceEnabled
                phoneNumberType
              }
            }
          }
        }
      }
    }
  }
`;
