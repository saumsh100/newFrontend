
import partition from 'lodash/partition';
import { receiveEntities, deleteEntity } from '../../reducers/entities';
import { httpClient } from '../../util/httpClient';

const isDeleted = entity =>
  entity.deletedAt || entity.isMissed || entity.isPending || entity.isDeleted || entity.isCancelled;

const handleDispatchingActions = (dispatch, key) => ({ data }) => {
  const [deletedEntities, entities] = partition(data.entities[key], isDeleted);

  deletedEntities.forEach((v) => {
    dispatch(
      deleteEntity({
        key,
        id: v.id,
      }),
    );
  });

  dispatch(
    receiveEntities({
      key,
      entities: {
        ...data.entities,
        [key]: entities.reduce(
          (acc, v) => ({
            ...acc,
            [v.id]: v,
          }),
          {},
        ),
      },
    }),
  );

  return data.entities;
};

export default function fetchEntities({ key, join, params = {}, url }) {
  return (dispatch, getState) => {
    // adding this so pass by reference params won't go for mulitple requests
    params = Object.assign({}, params);
    const { entities } = getState();
    const entity = entities.get(key);
    // Add onto the query param for join if passed in
    if (join && join.length) {
      params.join = join.join(',');
    }
    url = url || entity.getUrlRoot();
    return httpClient()
      .get(url, { params })
      .then(handleDispatchingActions(dispatch, key))
      .catch((err) => {
        // TODO: set didInvalidate=true of entity and dispatch alert action
        console.log(err);
      });
  };
}
