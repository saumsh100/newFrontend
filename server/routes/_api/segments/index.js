
import { Router } from 'express';
import db from '../../../_models/index';
import { sequelizeLoader } from '../../util/loaders';
import checkPermissions from '../../../middleware/checkPermissions';
import normalize from '../../api/normalize';

const segmentRouter = Router();

const Segment = db.Segment;
const Patient = db.Patient;
const Account = db.Account;
const Appointment = db.Appointment;

segmentRouter.param('segmentId', sequelizeLoader('segment', 'Segment'));


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

    const segments = await Segment.findAll({
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
    data.reference = data.reference || Segment.REFERENCE.ENTERPRISE;
    data.referenceId = (data.reference === Segment.REFERENCE.ENTERPRISE)
      ? req.enterpriseId : req.accountId;

    data.where = Segment.convertRawToSequelizeWhere(data.rawWhere);

    const segment = await Segment.create(data);

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

// @TODO This should be updated so it can be used/applied to any data set existing in dashboard.
segmentRouter.post('/preview', checkPermissions('segments:delete'), async (req, res, next) => {
  const { rawWhere } = req.body;
  try {
    const segmentWhere = Segment.convertRawToSequelizeWhere(rawWhere);
    const accountWhere = {
      enterpriseId: req.enterpriseId,
    };

    // @TODO Add selectors for city


    // fetch all enterprise accounts
    const accountsTotal = await Account.findAll({
      raw: true,
      where: accountWhere,
    });
    const accountIds = accountsTotal.map(account => account.id);

    // Expand accounts query where with segment information if exists
    if (segmentWhere.account && segmentWhere.account.city) {
      accountWhere.city = segmentWhere.account.city;
    }

    const accountsFiltered = await Account.findAll({
      raw: true,
      where: accountWhere,
    });
    const accountIdsFiltered = accountsFiltered.map(account => account.id);


    const baseWhere = {
      accountId: accountIds,
      status: Patient.STATUS.ACTIVE,
    };

    const totalActiveUsers = await Patient.count({
      where: baseWhere,
    });

    const totalAppointments = await Appointment.count({
      include: [
        {
          model: Patient,
          as: 'patient',
          where: baseWhere,
        },
      ],
    });

    // Change baseWhere to apply filtered account data
    baseWhere.accountId = accountIdsFiltered;
    const segmentActiveUsersWhere = { ...baseWhere, ...segmentWhere.patient };

    const segmentActiveUsers = await Patient.count({
      where: segmentActiveUsersWhere,
    });

    const segmentAppointments = await Appointment.count({
      include: [
        {
          model: Patient,
          as: 'patient',
          where: segmentActiveUsersWhere,
        },
      ],
    });

    const data = {
      totalActiveUsers,
      segmentActiveUsers,
      totalAppointments,
      segmentAppointments,
    };

    return res.send(data);
  } catch (error) {
    return next(error);
  }
});

export default segmentRouter;
