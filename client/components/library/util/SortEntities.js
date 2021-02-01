
import { getUTCDate } from './datetime';

export const SortByFirstName = (a, b) => {
  if (!a.firstName || !b.firstName) return -1;
  if (a.firstName.toLowerCase() < b.firstName.toLowerCase()) return -1;
  if (a.firstName.toLowerCase() > b.firstName.toLowerCase()) return 1;
  return 0;
};

export const SortByStartDate = (a, b) => {
  if (getUTCDate(a.startDate).isBefore(getUTCDate(b.startDate))) return -1;
  if (getUTCDate(a.startDate).isAfter(getUTCDate(b.startDate))) return 1;
  if (getUTCDate(a.createdAt).isBefore(getUTCDate(b.createdAt))) return 1;
  return 0;
};

export const SortByName = (a, b) => {
  if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
  if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
  return 0;
};

export const SortByCreatedAtDesc = (a, b) => {
  if (getUTCDate(b.createdAt).isBefore(getUTCDate(a.createdAt))) return -1;
  if (getUTCDate(b.createdAt).isAfter(getUTCDate(a.createdAt))) return 1;
  return 0;
};

export const sortByField = (collection, fieldDate) =>
  collection.sort((a, b) => {
    if (getUTCDate(a[fieldDate]).isBefore(getUTCDate(b[fieldDate]))) return -1;
    if (getUTCDate(a[fieldDate]).isAfter(getUTCDate(b[fieldDate]))) return 1;
    return 0;
  });

export const sortByFieldAsc = (collection, fieldDate) =>
  collection.sort((a, b) => {
    if (getUTCDate(b[fieldDate]).isBefore(getUTCDate(a[fieldDate]))) return -1;
    if (getUTCDate(b[fieldDate]).isAfter(getUTCDate(a[fieldDate]))) return 1;
    return 0;
  });

export const sortTextMessages = (messageOne, messageTwo) => {
  const dateOne = new Date(messageOne.createdAt);
  const dateTwo = new Date(messageTwo.createdAt);
  return dateOne - dateTwo;
};
