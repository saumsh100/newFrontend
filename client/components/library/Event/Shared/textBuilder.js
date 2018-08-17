
export default function getEventText(lang, event, key) {
  return eventLanguages[lang][event][key];
}

const eventEnglishText = {
  appointments: {
    cancelled: ({ appDate }) => `Cancelled appointment for ${appDate}`,
    booked: ({ appDate }) => `Booked appointment for ${appDate}`,
    completed: ({ appDate }) => `Completed appointment on ${appDate}`,
  },
  requests: {
    confirmed: 'Online appointment requested for',
    rejected: 'Online appointment request rejected for',
  },
  reviews: {
    completed: 'left a CareCru review for the appointment on',
    incomplete: 'Review was sent out but no feedback was given for the appointment on',
  },
  dueDate: {
    upcoming: 'is due for an upcoming',
    pastDue: 'was due for a',
    pastTense: 'appointment on',
    futureTense: 'appointment for',
  },

  recalls: {
    hygiene: ({ sentDate, contactMethod }) => `Sent ${contactMethod} Hygiene Recall on ${sentDate}`,
    recall: ({ intervalText, contactMethod, sentDate }) =>
      `Sent '${intervalText} Due Date' ${contactMethod} Recall on ${sentDate}`,
  },
};

const eventLanguages = { english: eventEnglishText };
