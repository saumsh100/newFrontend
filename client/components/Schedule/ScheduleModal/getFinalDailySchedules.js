
import { addOffset } from '../../library/util/datetime/helpers';
import { bookingWidgetHttpClient } from '../../../util/httpClient';

export default ({ accountId, reasonId: serviceId, practitionerId, startDate, endDate, timezone }) =>
  bookingWidgetHttpClient().get(`/accounts/${accountId}/availabilities`, {
    params: {
      startDate,
      endDate: endDate || addOffset(startDate, '1 day', timezone).toISOString(),
      serviceId,
      practitionerId,
      debug: true,
    },
  });
