
export function getIds(patients, key) {
  return patients.map((patient) => {
    return patient[key]
  });
}
