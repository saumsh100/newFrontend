import moment from 'moment';
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

function convertRawToSequelizeWhere(raw) {
  const patientWhere = {};
  const accountWhere = {};

  if (raw.city) {
    accountWhere.city = raw.city;
  }

  if (raw.gender) {
    patientWhere.gender = raw.gender;
  }

  if (raw.age) {
    const ageRanges = [];


    raw.age.forEach((ageSet) => {
      const ages = ageSet.split('-');
      if (!ages[1]) {
        const age = ages[0].replace('+', '');
        ageRanges.push({
          $lt: [moment().add(-parseInt(age, 10), 'years').toISOString()],
        });
      } else {
        ageRanges.push({
          $between: [moment().add(-parseInt(ages[1], 10), 'years').toISOString(), moment().add(-parseInt(ages[0], 10), 'years').toISOString()],
        });
      }
    });

    patientWhere.birthDate = {
      $or: ageRanges,
    };
  }


  return {
    account: accountWhere,
    patient: patientWhere,
  };
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

    data.where = convertRawToSequelizeWhere(data.rawWhere);

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

segmentRouter.post('/preview', checkPermissions('segments:delete'), async (req, res, next) => {
  const { rawWhere } = req.body;
  try {
    const segmentWhere = convertRawToSequelizeWhere(rawWhere);
    const accountWhere = {
      enterpriseId: req.enterpriseId,
    };

    // @TODO Add selectors for city
    if (segmentWhere.account && segmentWhere.account.city) {
      accountWhere.city = segmentWhere.account.city;
    }

    // fetch all enterprise accounts
    const accounts = await Account.findAll({
      raw: true,
      where: accountWhere,
    });
    const accountIds = accounts.map(account => account.id);

    const baseWhere = {
      accountId: accountIds,
      status: Patient.STATUS.ACTIVE,
    };

    const totalActiveUsers = await Patient.count({
      where: baseWhere,
    });

    const segmentActiveUsersWhere = { ...baseWhere, ...segmentWhere.patient };

    const segmentActiveUsers = await Patient.count({
      where: segmentActiveUsersWhere,
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
