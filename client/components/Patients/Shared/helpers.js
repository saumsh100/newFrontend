
import moment from 'moment-timezone';

export const validDateValue = (date) => {
  const dateValue = moment(date);
  return dateValue.isValid() ? dateValue.format('MMM Do, YYYY') : 'n/a';
};

export const familyDataSelector = (accountViewer) => {
  if (!accountViewer) {
    return {
      patientNode: {},
      family: {},
      familyLength: 0,
    };
  }

  const patientNode = accountViewer.patient;
  const family = accountViewer.patient.family;
  const familyLength = family ? family.members.edges.length : 0;

  return {
    patientNode,
    family,
    familyLength,
  };
};

export const sortEvents = collection =>
  collection.sort((a, b) => {
    if (b.metaData.createdAt < a.metaData.createdAT) return -1;
    if (b.metaData.createdAt > a.metaData.createdAt) return 1;
    return 0;
  });
