
import { addOffset } from '@carecru/isomorphic';
import { bookingWidgetHttpClient } from '../../../util/httpClient';

export default ({ accountId, reasonId: serviceId, practitionerId, startDate, endDate }) =>
  bookingWidgetHttpClient().get(`/accounts/${accountId}/availabilities`, {
    params: {
      startDate,
      endDate: endDate || addOffset(startDate, '1 day').toISOString(),
      serviceId,
      practitionerId,
      debug: true,
    },
  });
