import { setCancelationList } from '../actions/schedule';
import { cancellationListItem } from '../components/Requests/CancellationData/thunks';

export default function loadCancelations(accountId) {
  return (dispatch) =>
    cancellationListItem(accountId).then((result) =>
      dispatch(setCancelationList(result.data || [])),);
}
