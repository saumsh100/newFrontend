
import { fetchEntitiesRequest } from './fetchEntities';

export function loadOnlineRequest() {
  return (dispatch) => {
    dispatch(
      fetchEntitiesRequest({
        id: 'scheduleRequests',
        key: 'requests',
        join: ['service', 'patientUser', 'requestingPatientUser', 'practitioner'],
      }),
    );
  };
}
