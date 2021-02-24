
import { Record } from 'immutable';

export default function createModel(schema, name = undefined) {
  const modelSchema = Object.assign({}, schema, {
    isFetching: false,
  });

  return class Model extends Record(modelSchema, name) {
    constructor(...params) {
      super(...params);
      return this;
    }

    /**
     *  Insert any standard member functions here for our
     *  client side models.
     */

    getId() {
      return this.get('id');
    }

    getUrlRoot() {
      throw new Error('This Model does not have support for fetching');
    }
  };
}
