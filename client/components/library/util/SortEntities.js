import moment from 'moment';

export const SortByFirstName = (a, b) => {
  if (a.firstName.toLowerCase() < b.firstName.toLowerCase()) return -1;
  if (a.firstName.toLowerCase() > b.firstName.toLowerCase()) return 1;
  return 0;
};

export const SortByStartDate = (a, b) => {
  if (moment(a.startDate).isBefore(moment(b.startDate))) return -1;
  if (moment(a.startDate).isAfter(moment(b.startDate))) return 1;
  return 0;
}

export const SortByName = (a, b) => {
  if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
  if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
  return 0;
};

export const SortByCreatedAtDesc = (a, b) => {
  if (moment(b.createdAt).isBefore(moment(a.createdAt))) return -1;
  if (moment(b.createdAt).isAfter(moment(a.createdAt))) return 1;
  return 0;
};
