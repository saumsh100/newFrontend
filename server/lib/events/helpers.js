
/**
 * Groups events by checking if the next event is the same based on some conditional.
 * If they are the same then it will take the first event and modify an attribute to signify that
 * it is a grouped event.
 * @param {*} events array of event types.
 * @param {*} conditionalCheck callback that applies a conditional and if true merges the events
 * @param {*} mergeParam an updated event parameter that will tell that it is merged.
 */
export default function groupEvents(events, conditionalCheck, mergeParam) {
  const length = events.length - 1;
  const groupedEvents = [];

  if (length <= 0) {
    return events;
  }

  for (let i = 0; i < length; i += 1) {
    const event = events[i];
    const nextIndex = i + 1;

    if (length - 1 >= nextIndex) {
      const nextEvent = events[nextIndex];

      if (conditionalCheck(event, nextEvent)) {
        const mergedEvent = { ...event, ...mergeParam };
        groupedEvents.push(mergedEvent);
        i += 1;
      }
    } else {
      groupedEvents.push(event);
    }
  }
  return groupedEvents;
}
