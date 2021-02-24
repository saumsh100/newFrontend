
import { Map, Record } from 'immutable';

export default function createCollection(Model) {
  const CollectionSchema = Object.assign(
    {},
    {
      isFetching: false,
      isCollection: true,
      models: Map({}),
    },
  );

  return class Collection extends Record(CollectionSchema) {
    /**
     *  Insert any standard member functions here for our
     *  client side Collections.
     */
    getModel() {
      return Model;
    }
  };
}
