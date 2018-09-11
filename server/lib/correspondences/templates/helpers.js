
/**
 * Factory function to get the proper template.
 * Template should be a function that returns a object with type, subtype properties, it can also
 * accept props.
 *
 * @param {function} template
 * @param {string} type
 * @param {string} subType
 * @param {object} props
 */
export const templatesFactory =
    template => type => subType => props => template(props)[type][subType];
  
/**
 * Decide the template subtype base on the parameters object
 *
 * @param {string} param.contactedPatientId
 * @param {string} param.appointmentPatientId
 * @param {bool} param.isFamily
 */
export const getTemplateSubType = ({ contactedPatientId, appointmentPatientId, isFamily }) => {
  if (!isFamily) {
    return 'single';
  }
  
  return contactedPatientId === appointmentPatientId ? 'familyPOC' : 'familyOther';
};
