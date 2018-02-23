
import { Call, Patient, Event } from '../../../_models';

export function fetchCallEvents(patientId, accountId, query) {
  return Call.findAll({
    raw: true,
    where: {
      patientId,
    },
    order: [['createdAt', 'DESC']],
    ...query,
  }).then((calls) => {
    const callEvents = calls.map((call) => {
      const buildData = {
        id: call.id,
        patientId,
        accountId,
        type: 'Call',
        metaData: {
          createdAt: call.createdAt,
          recording: call.recording,
          duration: call.duration,
          answered: call.answered,
          callerCity: call.callerCity,
          callSource: call.callSource,
          startTime: call.startTime,
        },
      };
      const ev = Event.build(buildData);
      return ev.get({ plain: true });
    });

    return callEvents;
  })
}
