
import get from 'lodash/get';
import StatusError from '../../../../server/util/StatusError';

/**
 * A sanity check function that checks all the required fields exist
 * @param object the object that needs validating
 * @param fields an array of fields that needs validating
 */
function fieldsValidator(object, fields) {
  if (!object) {
    throw new Error('object in not set');
  }

  fields.forEach((field) => {
    if (!get(object, field)) {
      throw StatusError(
        StatusError.BAD_REQUEST,
        `${field} is not set`,
      );
    }
  });
}

export default fieldsValidator;
