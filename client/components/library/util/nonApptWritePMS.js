const NON_APPT_WRITE_PMS = ['dentrix'];
const DENTRIX_APPT_WRITE_PMS = ['DENTRIX_ENTERPRISE_V80'];
/**
 * Check if PMS is non appointment write,
 * for now, any version of Dentrix not able to write.
 */
export const nonApptWritePMS = (adapterType) => {
  const dentrixException = DENTRIX_APPT_WRITE_PMS.find((name) => name === adapterType);
  if (dentrixException) return !dentrixException;
  const type = String(adapterType).toLowerCase();
  return !!NON_APPT_WRITE_PMS.find((name) => type?.includes(name));
};

export default nonApptWritePMS;
