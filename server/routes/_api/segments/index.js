import { Router } from 'express';
import {
  Patient as PatientModel,
  Segment as SegmentModel,
  Account as AccountModel,
  Appointment as AppointmentModel,
  Practitioner as PractitionerModel,
  sequelize,
} from '../../../_models/index';
import { sequelizeLoader } from '../../util/loaders';
import checkPermissions from '../../../middleware/checkPermissions';
import normalize from '../../api/normalize';

const segmentRouter = Router();

segmentRouter.param('segmentId', sequelizeLoader('segment', 'Segment'));

function convertRawToSequelizeWhere(raw) {
  // @TODO add conversion here
  return {};
}
// Get single segment info
segmentRouter.get('/:segmentId', checkPermissions('segments:read'), async (req, res, next) => {
  try {
    const segment = req.segment;
    // Check if our enterprise or account is segment owner
    segment.isOwner(req);

    return res.send(normalize('segment', segment.get({
      plain: true,
    })));
  } catch (error) {
    return next(error);
  }
});

segmentRouter.get('/', checkPermissions('segments:read'), async (req, res, next) => {
  try {
    // Should add for account, now only returns for enterprise
    const segments = await SegmentModel.findAll({
      raw: true,
      where: {
        referenceId: req.enterpriseId,
      },
    });

    return res.send(normalize('segments', segments));
  } catch (error) {
    return next(error);
  }
});

// Create segment.
segmentRouter.post('/', checkPermissions('segments:create'), async (req, res, next) => {
  const data = req.body;
  try {
    data.reference = data.reference || SegmentModel.REFERENCE.ENTERPRISE;
    data.referenceId = (data.reference === SegmentModel.REFERENCE.ENTERPRISE)
      ? req.enterpriseId : req.accountId;

    const segment = await SegmentModel.create(data);

    return res.status(201).send(normalize('segment', segment.get({
      plain: true,
    })));
  } catch (error) {
    return next(error);
  }
});

// Update segment.
segmentRouter.put('/:segmentId', checkPermissions('segments:update'), async (req, res, next) => {
  const data = req.body;

  try {
    // Check if logged in user is owner of requested object
    req.segment.isOwner(req);

    // cannot change entepriseId and reference
    if (data.reference) {
      delete data.reference;
    }

    if (data.referenceId) {
      delete data.referenceId;
    }

    const segment = await req.segment.update(data);
    return res.send(normalize('segment', segment.get({
      plain: true,
    })));
  } catch (error) {
    return next(error);
  }
});

// Delete segment
segmentRouter.delete('/:segmentId', checkPermissions('segments:delete'), async (req, res, next) => {
  try {
    // Check if logged in user is owner of requested object
    req.segment.isOwner(req);

    await req.segment.destroy();
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

segmentRouter.post('/preview', checkPermissions('segments:delete'), async (req, res, next) => {
  const { rawWhere } = req.body;
  try {
    // fetch all enterprise accounts
    const attributesUsers = ['Patient.id', [sequelize.fn('count', sequelize.col('Patient.id')), 'patientCount']];
    const attributesAppo = [[sequelize.fn('count', sequelize.col('Appointment.id')), 'appointmentCount']];
    const accounts = AccountModel.findAll({
      raw: true,
      where: {
        enterpriseId: req.enterpriseId,
      },
    });
    const accountIds = accounts.map(account => account.id);

    const baseWhere = {
      accountId: accountIds,
      status: PatientModel.STATUS.ACTIVE,
    };

    const totalActiveUsers = await PatientModel.findOne({
      attributes: attributesUsers,
      where: {
        baseWhere,
      },
      group: ['Patient.id'],
    });

    const segmentWhere = convertRawToSequelizeWhere(rawWhere);

    const segmentActiveUsers = await PatientModel.findOne({
      attributes: attributesUsers,
      where: {
        ...baseWhere, ...segmentWhere,
      },
      group: ['Patient.id'],
    });

    const totalAppointments = await PatientModel.findOne({
      attributes: attributesAppo,
      where: {
        baseWhere,
      },
      group: ['Appointment.id'],
    });

    const segmentAppointments = await PatientModel.findOne({
      attributes: attributesAppo,
      where: {
        ...baseWhere, ...segmentWhere,
      },
      group: ['Appointment.id'],
    });


    const data = {
      totalActiveUsers: totalActiveUsers.patientCount,
      segmentActiveUsers: segmentActiveUsers.patientCount,
      totalAppointments: totalAppointments.appointmentCount,
      segmentAppointments: segmentAppointments.appointmentCount,
    };

    return res.send(data);
  } catch (error) {
    return next(error);
  }
});

export default segmentRouter;
