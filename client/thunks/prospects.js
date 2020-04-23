
import { setIsFetchingProspect, setProspect } from '../reducers/chat';
import { httpClient } from '../util/httpClient';

/**
 * determineProspectForChat is a thunk that will determine if the supplied chat data
 * requires an api call for prospect data based on the chat's patient phone number
 *
 * @param accountId
 * @param patientId
 * @param patientPhoneNumber
 */
export default function determineProspectForChat({ accountId, patientId, patientPhoneNumber }) {
  return async (dispatch) => {
    // Early return if the selected chat belongs to a patient
    if (patientId) return dispatch(setProspect(null));

    dispatch(setIsFetchingProspect(true));

    try {
      const { data } = await httpClient().get('/api/prospects', {
        params: {
          accountId,
          phoneNumber: patientPhoneNumber,
        },
      });

      dispatch(setProspect(data));
    } catch (err) {
      console.error(`Failed to fetch prospect data: ${err}`);
    }

    dispatch(setIsFetchingProspect(false));
  };
}
