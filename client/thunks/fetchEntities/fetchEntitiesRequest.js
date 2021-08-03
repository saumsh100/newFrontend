import { receiveEntities } from '../../reducers/entities';
import { createRequest, receiveRequest, errorRequest } from '../../reducers/apiRequests';
import { httpClient } from '../../util/httpClient';

export default function fetchEntitiesRequest({
  id,
  key,
  base,
  join,
  params = {},
  url,
  returnData,
  shouldCreateRequest = true,
}) {
  return (dispatch, getState) => {
    const { entities } = getState();
    const entity = entities.get(key);
    // Add onto the query param for join if passed in
    if (join && join.length) {
      params.join = join.join(',');
    }

    url = url || entity.getUrlRoot(base);

    if (shouldCreateRequest) {
      // Create record for request
      dispatch(createRequest({ id }));
    }

    return httpClient()
      .get(url, { params })
      .then((response) => {
        const { data } = response;
        dispatch(
          receiveRequest({
            id,
            data,
          }),
        );
        dispatch(
          receiveEntities({
            key,
            entities: data.entities,
          }),
        );
        return returnData ? data : data.entities;
      })
      .catch((error) => {
        // TODO: set didInvalidate=true of entity and dispatch alert action
        errorRequest({
          id,
          error,
        });
        throw error;
      });
  };
}
