
export function ManualLimitOffset(eventsArray, query) {
  const {
    limit,
    offset,
    order,
  } = query;


  let filterArray = eventsArray;

  if (offset && eventsArray.length > offset) {
    filterArray = filterArray.slice(offset, eventsArray.length);
  }

  if (limit) {
    filterArray = filterArray.slice(0, limit);
  }

  return filterArray;
}

export function getIds(patients, key) {
  return patients.map((patient) => {
    return patient[key];
  });
}
