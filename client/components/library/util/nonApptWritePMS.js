
const NON_APPT_WRITE_PMS = ['dentrix'];

/**
 * Check if PMS is non appointment write,
 * for now, any version of Dentrix not able to write.
 */
export const nonApptWritePMS = (adapterType) => {
  const type = String(adapterType).toLowerCase();
  return !!NON_APPT_WRITE_PMS.find(name => type?.includes(name));
};

export default nonApptWritePMS;
