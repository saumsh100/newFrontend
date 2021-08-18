import { getDate } from '../../../../library';

/**
 * @param waitlist
 * @param filterRules
 */

// eslint-disable-next-line import/prefer-default-export
export function applyAllFilters(waitlist, filterRules) {
  const { reasons, practitioners, units, dayOfWeek, times } = filterRules;
  const filterLookUp = [
    {
      filter: reasons,
      applyFilter: reasonsFilter,
    },
    {
      filter: practitioners,
      applyFilter: practitionersFilter,
    },
    {
      filter: units,
      applyFilter: unitsFilter,
    },
    {
      filter: dayOfWeek,
      applyFilter: dayOfWeekFilter,
    },
    {
      filter: times,
      applyFilter: timesFilter,
    },
  ];

  let filteredWaitList = waitlist;

  filterLookUp.forEach(({ filter, applyFilter }) => {
    const { rule, isActive, showNotSet } = filter;
    if (isActive) {
      filteredWaitList = applyFilter(filteredWaitList, rule, showNotSet);
    }
  });

  return filteredWaitList;
}

/**
 * @param waitlist - Array
 * @param filterRule - Object
 * @param showNotSet - Boolean
 * @return Array
 */
function reasonsFilter(waitlist, filterRule, showNotSet) {
  return waitlist.filter(({ reasonText }) => {
    const activeReasons = Object.entries(filterRule)
      .filter(([, value]) => value)
      .map(([key]) => key);

    if (!reasonText) {
      return showNotSet;
    }

    return activeReasons.includes(reasonText);
  });
}

/**
 * @param waitlist - Array
 * @param filterRule - Object
 * @param showNotSet - Boolean
 * @return Array
 */
export function dayOfWeekFilter(waitlist, filterRule, showNotSet) {
  return waitlist.filter(({ daysOfTheWeek }) => {
    const activeFilterRuleEntries = Object.entries(filterRule).filter(([, value]) => value);
    const activeFilterRule = Object.fromEntries(activeFilterRuleEntries);
    const daysOfTheWeekEntries = Object.entries(daysOfTheWeek);
    const activeDaysOfTheWeekEntries = daysOfTheWeekEntries.filter(([, value]) => value);

    // check how many rules is satisfied
    const filteredLength = daysOfTheWeekEntries.filter(
      ([key, value]) => value === activeFilterRule[key],
    ).length;

    if (activeDaysOfTheWeekEntries.length === 0) {
      return showNotSet;
    }
    return filteredLength > 0;
  });
}

/**
 * @param waitlist - Array
 * @param filterRule - Object
 * @param showNotSet - Boolean
 * @return Array
 */

const timesFilter = (waitlist, filterRule, showNotSet) =>
  waitlist.filter((waitspot) => {
    if (showNotSet && waitspot?.availableTimes?.length === 0) {
      return waitspot;
    }
    const { availableTimes } = waitspot;
    return availableTimes.find((time) => filterRule[getDate(time).toISOString()]);
  });

/**
 * @param waitlist - Array
 * @param filterRule - Object
 * @param showNotSet - Boolean
 * @return Array
 */

const practitionersFilter = (waitlist, filterRule, showNotSet) =>
  waitlist.filter(({ practitioner }) => {
    if (showNotSet && !practitioner) {
      return true;
    }
    return filterRule.find((pract) => pract.id === practitioner?.ccId && pract.selected);
  });
/**
 * @param waitlist - Array
 * @param filterRule - Object
 * @param showNotSet - Boolean
 * @return Array
 */
function unitsFilter(waitlist, filterRule, showNotSet) {
  return waitlist.filter(({ duration }) => {
    const { min, max } = filterRule;
    const units = parseInt(duration, 10);

    if (!units) {
      return showNotSet;
    }

    if (min === null && max) {
      return units <= max;
    }

    if (min && max === null) {
      return min <= units;
    }

    return min <= units && units <= max;
  });
}

/**
 * @param waitlist - Array
 * @param searchQuery - string
 * @return Array
 */
export const patientSearch = (waitlist, searchQuery) => {
  if (!searchQuery) return waitlist;
  return waitlist.filter(({ patient }, item) => {
    const { firstName, lastName } = patient;
    const patientName = `${firstName}${lastName}`.toLowerCase();
    const query = searchQuery.replaceAll(' ', '').toLowerCase();
    if (patientName.includes(query)) {
      return item;
    }
    return false;
  });
};
