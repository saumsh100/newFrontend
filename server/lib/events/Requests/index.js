
import { Request, PatientUser, Patient, Event } from '../../../_models';

export function fetchRequestEvents(patientId, accountId, query) {
  const patientUserExists = Patient.findOne({
    where: {
      id: patientId,
      accountId,
      patientUserId: {
        $ne: null,
      },
    },
  });

  if (patientUserExists) {
    return Request.findAll({
      raw: true,
      where: {
        accountId,
        patientUserId: patientUserExists.patientUserId,
        isCancelled: false,
      },
      ...query,
      order: [['createdAt', 'DESC']],
    }).then((requests) => {
      return requests.map((req) => {
        const buildData = {
          id: req.id,
          patientId,
          accountId,
          type: 'Request',
          metaData: {
            createdAt: req.createdAt,
            startDate: req.startDate,
            endDate: req.endDate,
            note: req.note,
            isConfirmed: req.isConfirmed,
          },
        };

        const ev = Event.build(buildData);
        return ev.get({ plain: true });
      });
    });
  }

  return [];
}
