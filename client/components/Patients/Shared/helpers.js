
import moment from 'moment-timezone';
import classnames from 'classnames';

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
    if (b.metaData.timelineDate < a.metaData.timelineDate) return -1;
    if (b.metaData.timelineDate > a.metaData.timelineDate) return 1;
    return 0;
  });

export const getEventsOffsetLimitObj = (limit = 5) => ({
  reminder: {
    offset: 0,
    limit,
  },
  review: {
    offset: 0,
    limit,
  },
  appointment: {
    offset: 0,
    limit,
  },
  call: {
    offset: 0,
    limit,
  },
  recall: {
    offset: 0,
    limit,
  },
  reviews: {
    offset: 0,
    limit,
  },
});

export const buildDotStyles = (dueForDate, styles) => {
  const monthsDiff = moment()
    .startOf('day')
    .diff(dueForDate, 'months', true);

  return classnames(styles.dot, {
    [styles.dotGrey]: monthsDiff >= 18,
    [styles.dotRed]: monthsDiff >= 8 && monthsDiff < 18,
    [styles.dotYellow]: monthsDiff >= 0 && monthsDiff < 8,
    [styles.dotGreen]: monthsDiff >= -2 && monthsDiff < 0,
  });
};
