
import { sortAsc, setDateToTimezone } from '@carecru/isomorphic';
import { getReminderType } from '../createReminderText';
import isFeatureFlagEnabled from '../../featureFlag';

export function generateFamilyDetails(dependants, timezone) {
  if (dependants.length > 1) {
    const familyDetails = dependants
      .sort(
        (
          { appointment: { startDate: a } },
          { appointment: { startDate: b } },
        ) => sortAsc(a, b),
      )
      .map(({ appointment: { startDate }, firstName, lastName }) => {
        const { date, time } = getDateAndTime(startDate, timezone);
        return `\n${firstName} ${lastName}\n${date} at ${time}\n`;
      })
      .join('');

    return { familyDetails };
  }

  const [familyMember] = dependants;
  const {
    appointment: { startDate },
  } = familyMember;

  return {
    familyMember,
    ...getDateAndTime(startDate, timezone),
  };
}

export function getDateAndTime(date, timezone) {
  const mDate = setDateToTimezone(date, timezone);
  return {
    date: mDate.format('MMMM Do'),
    time: mDate.format('h:mma'),
  };
}

/**
 * Feature flag is here so that both the Preview API and the actual
 * reminders job can utilize the same function
 * @param account
 * @return {Promise<boolean>}
 */
export async function shouldUseLegacyTemplate(account) {
  const isCustomizable = isFeatureFlagEnabled(
    'customizable-reminders-templates',
    false,
    {
      userId: 'carecru-api',
      accountId: account.id,
      enterpriseId: account.enterpriseId,
    },
  );

  return !isCustomizable;
}

export function getReminderTemplateType({
  account,
  appointment,
  reminder,
  currentDate,
  dependants,
}) {
  if (isFamily(dependants)) {
    if (appointment) {
      return 'self';
    }

    return dependants.length === 1 ? 'single' : 'multiple';
  }

  const templateTypes = {
    weeksAway: 'weeks-away',
    weekAway: 'week-away',
    sameWeek: 'same-week',
    sameDay: 'same-day',
  };

  // Don't pass in appointment so it uses the reminder.interval instead
  const reminderType = getReminderType({
    account,
    appointment,
    reminder,
    currentDate,
  });

  return templateTypes[reminderType];
}

export function isFamily(dependants) {
  return dependants && dependants.length > 0;
}
