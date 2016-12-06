
import { Record } from 'immutable';

export default function createModel(schema) {
  const modelSchema = Object.assign({}, schema, {
    lastUpdated: null,
    isFetching: false,
    
  });
  
  return class Model extends Record(modelSchema) {
  
    constructor(...params) {
      super(...params);
      return this.get('lastUpdated') == null ? this.set('lastUpdated', Date.now()) : this;
    }
    
    /**
     *  Insert any standard member functions here for our
     *  client side models.
     */
  };
}
